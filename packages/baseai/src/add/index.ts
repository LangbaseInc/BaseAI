import { getStoredAuth } from '@/auth';
import { dim, dimItalic } from '@/utils/formatting';
import { getAvailablePipes } from '@/utils/get-available-pipes';
import { getAvailableTools } from '@/utils/get-available-tools';
import { heading } from '@/utils/heading';
import icons from '@/utils/icons';
import { isToolPresent } from '@/utils/is-tool-present';
import { formatCode } from '@/utils/ts-format-code';
import * as p from '@clack/prompts';
import slugify from '@sindresorhus/slugify';
import camelCase from 'camelcase';
import figures from 'figures';
import fs from 'fs';
import pMap from 'p-map';
import path from 'path';
import color from 'picocolors';
import type { Pipe } from 'types/pipe';
import type { PipeTool } from 'types/tools';

interface ErrorResponse {
	error?: { message: string };
}

type Spinner = ReturnType<typeof p.spinner>;

/**
 * Extracts the login name and name from a given pipe-separated string.
 *
 * @param loginAndPipe - login/pipe string to extract from.
 * @returns An object containing the extracted `login` and `name`.
 */
function extractLoginName(loginAndPipe: string) {
	if (!loginAndPipe) return { login: '', name: '' };

	const split = loginAndPipe.split('/');
	const length = split.length;

	if (length < 2) return { login: '', name: '' };

	return {
		login: split[length - 2],
		name: split[length - 1]
	};
}

/**
 * Represents an account with login credentials and an API key.
 */
interface Account {
	login: string;
	apiKey: string;
}

/**
 * Retrieves the stored authentication account.
 *
 * This function attempts to retrieve the stored authentication account
 * asynchronously. If the account is found, it is returned. If no account
 * is found or an error occurs during retrieval, `null` is returned.
 *
 * @returns {Promise<Account | null>} A promise that resolves to the stored
 * authentication account, or `null` if no account is found or an error occurs.
 */
async function retrieveAuthentication(): Promise<Account | null> {
	try {
		const account = await getStoredAuth();
		if (!account) return null;

		return account;
	} catch (error) {
		p.log.error(
			`Error retrieving stored auth: ${(error as Error).message}`
		);
		return null;
	}
}

/**
 * Fetches a pipe from Langbase using the provided login and name.
 *
 * @param {Object} params - The parameters for fetching the pipe.
 * @param {string} params.login - The login identifier.
 * @param {string} params.name - The name of the pipe.
 * @param {Spinner} params.spinner - The spinner instance for displaying loading status.
 * @returns {Promise<Pipe | null>} - A promise that resolves to the fetched pipe or null if an error occurs.
 */
async function getPipe({
	login,
	name,
	spinner
}: {
	login: string;
	name: string;
	spinner: Spinner;
}) {
	spinner.start('Fetching pipe from Langbase');
	try {
		const account = await retrieveAuthentication();
		const API_URL = `https://api.langbase.com/v1/pipes/${login}/${name}`;

		const createResponse = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(account && { Authorization: `Bearer ${account.apiKey}` })
			}
		});

		if (createResponse.ok) {
			spinner.stop('Fetched pipe from Langbase');
			return (await createResponse.json()) as Pipe;
		}

		const errorData = (await createResponse.json()) as ErrorResponse;

		if (errorData) {
			spinner.stop(
				`Failed to fetch pipe from Langbase: ${errorData.error?.message}`
			);
			process.exit(1);
		}
	} catch (error: any) {
		spinner.stop(error);
		return null;
	}
}

/**
 * Asynchronously creates local tools based on the provided `Pipe` object.
 *
 * @param {Pipe} pipe - The pipe object containing tools to be created.
 *
 * The function performs the following steps:
 * 1. Checks if there are any tools in the `pipe`. If none, it returns immediately.
 * 2. Retrieves all available tools.
 * 3. Iterates over each tool in the `pipe` and checks if the tool is already present.
 * 4. If the tool is present, prompts the user to confirm if they want to overwrite the existing tool.
 * 5. If the user chooses not to overwrite, the tool creation is skipped.
 * 6. If the tool is not present or the user chooses to overwrite, the tool's code is generated and formatted.
 * 7. The formatted code is then written to a file in the `baseai/tools` directory.
 * 8. If any error occurs during the process, it is caught and an appropriate message is displayed.
 */
async function createLocalTool(pipe: Pipe) {
	if (!pipe.tools.length) return;
	const allTools = await getAvailableTools();

	try {
		await pMap(
			pipe.tools,
			async tool => {
				const hasTool = isToolPresent({
					name: tool.function.name,
					allTools
				});

				if (hasTool) {
					const toolInfo = await p.group(
						{
							overwrite: () =>
								p.confirm({
									message: `${color.dim(icons.tool)} Tool: ${color.cyan(tool.function.name)} already exists. Do you want to overwrite it?`,
									initialValue: false
								})
						},
						{
							onCancel: () => {
								p.cancel('Operation cancelled.');
								process.exit(0);
							}
						}
					);

					if (!toolInfo.overwrite) {
						p.outro(`Skipped …`);
						return;
					}
				}

				const name = tool.function.name;
				const camelCaseName = camelCase(name);
				const slugifiedName = slugify(name);

				const code = `import { ToolI } from '@baseai/core';

			export async function ${name}() {
				// Your tool logic here
			}

			const ${camelCaseName}Tool = (): ToolI => ({
				run: ${name}, // Name of the function to run
				type: 'function' as const,
				function: {
					name: \`${name}\`,
					description: \`${tool.function.description}\`,
					parameters: ${JSON.stringify(tool.function.parameters || {}, null, 6)}
				}
			});

			export default ${camelCaseName}Tool;`;

				const formattedCode = await formatCode(code);

				const baseDir = path.join(process.cwd(), 'baseai', 'tools');
				const filePath = path.join(baseDir, `${slugifiedName}.ts`);

				await fs.promises.mkdir(baseDir, { recursive: true });
				await fs.promises.writeFile(filePath, formattedCode);
				p.outro(`Tool created successfully at ${filePath}`);
			},
			{ concurrency: 1 }
		);
	} catch (error: any) {
		p.cancel(`Error creating tool: ${error.message}`);
	}
}

/**
 * Transforms an array of `PipeTool` objects into an array of objects containing
 * tool call strings, import paths, and tool file names.
 *
 * @param tools - An array of `PipeTool` objects to be transformed.
 * @returns An array of objects, each containing:
 * - `toolCall`: A string representing the tool call.
 * - `importPath`: A string representing the import path for the tool.
 * - `toolFileName`: A string representing the file name of the tool.
 */
function getToolsPipeData(tools: PipeTool[]) {
	return tools.map(tool => {
		const toolFileName = slugify(tool.function.name);
		const toolName = `${camelCase(tool.function.name)}Tool`;
		const importPath = `import ${toolName} from '../tools/${toolFileName}';`;

		return {
			toolCall: `${toolName}()`,
			importPath,
			toolFileName
		};
	});
}

/**
 * Asynchronously creates a local pipe configuration file.
 *
 * This function performs the following steps:
 * 1. Retrieves all available pipes.
 * 2. Slugifies the provided pipe name.
 * 3. Checks if a pipe with the same name already exists.
 * 4. If the pipe exists, prompts the user to confirm overwriting the existing pipe.
 * 5. If the user chooses not to overwrite, the operation is skipped.
 * 6. Retrieves tool data for the provided pipe tools.
 * 7. Constructs the pipe content with the provided pipe details and tool data.
 * 8. Formats the generated pipe content.
 * 9. Creates the necessary directories and writes the formatted pipe content to a file.
 * 10. Outputs a success message upon successful creation of the pipe.
 *
 * @param {Pipe} pipe - The pipe object containing configuration details.
 * @returns {Promise<void>} - A promise that resolves when the pipe is successfully created.
 */
async function createLocalPipe(pipe: Pipe) {
	try {
		const allPipes = await getAvailablePipes();

		const pipeNameSlugified = slugify(pipe.name);

		const hasPipe = allPipes.some(p => p === pipeNameSlugified);

		if (hasPipe) {
			const pipeInfo = await p.group(
				{
					overwrite: () =>
						p.confirm({
							message: `PIPE: ${color.cyan(pipe.name)} already exists. Do you want to overwrite it?`,
							initialValue: false
						})
				},
				{
					onCancel: () => {
						p.cancel('Operation cancelled.');
						process.exit(0);
					}
				}
			);

			if (!pipeInfo.overwrite) {
				p.outro(`Skipped …`);
				return;
			}
		}

		const toolData = await getToolsPipeData(pipe.tools);

		const toolCalls = toolData.map(tool => tool.toolCall);
		const pipeNameCamelCase = camelCase('pipe-' + pipe.name);

		const messages = pipe.messages.map(message => ({
			...(message.name && { name: message.name }),
			role: message.role,
			content: message.content
		}));

		const pipeContent = `import { PipeI } from '@baseai/core';
${toolData.map(tool => tool.importPath).join('\n')}

		const ${pipeNameCamelCase} = (): PipeI => ({
			// Replace with your API key https://langbase.com/docs/api-reference/api-keys
			apiKey: process.env.LANGBASE_API_KEY!,
			name: \`${pipe.name}\`,
			description: \`${pipe.description}\`,
			status: \`${pipe.status}\`,
			model: \`${pipe.model}\`,
			stream: ${pipe.stream},
			json: ${pipe.json},
			store: ${pipe.store},
			moderate: ${pipe.moderate || true},
			top_p: ${pipe.top_p},
			max_tokens: ${pipe.max_tokens},
			temperature: ${pipe.temperature},
			presence_penalty: ${pipe.presence_penalty},
			frequency_penalty: ${pipe.frequency_penalty},
			stop: ${JSON.stringify(pipe.stop)},
			tool_choice: ${JSON.stringify(pipe.tool_choice)},
			parallel_tool_calls: ${pipe.parallel_tool_calls},
			messages: ${JSON.stringify(messages || [])},
			variables: ${JSON.stringify(pipe.variables)},
			tools: [${toolCalls}],
			memory: [],
		});

		export default ${pipeNameCamelCase};`;

		const formattedCode = await formatCode(pipeContent);

		const baseDir = path.join(process.cwd(), 'baseai', 'pipes');
		const filePath = path.join(baseDir, `${pipeNameSlugified}.ts`);

		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.writeFile(filePath, formattedCode);
		p.outro(`Pipe created successfully at ${filePath}`);
		p.outro(
			heading({
				text: pipeNameSlugified,
				sub: `pipe added \n ${dim(figures.pointer)} ${dimItalic(` ${filePath}`)}`,
				green: true
			})
		);
		process.exit(0);
	} catch (error: any) {
		p.cancel(`Error creating pipe: ${error.message}`);
	}
}

/**
 * Adds a pipe by extracting login and name from the provided pipe information,
 * fetching the pipe details, and creating local tool and pipe.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.pipeInfo - The pipe information string.
 * @returns {Promise<void>} - A promise that resolves when the pipe is added.
 */
export async function addPipe({ loginAndPipe }: { loginAndPipe: string }) {
	p.intro(
		heading({
			text: 'PIPE',
			sub: `Adding ${color.cyan(loginAndPipe)}`
		})
	);

	const { login, name } = extractLoginName(loginAndPipe);

	if (!login || !name) {
		p.log.error('Invalid pipe information provided');
		return;
	}

	const spinner = p.spinner();

	try {
		const pipe = await getPipe({ login, name, spinner });
		if (!pipe) return;

		await createLocalTool(pipe);
		await createLocalPipe(pipe);
	} catch (error: any) {
		spinner.stop('An unexpected error occurred');
		p.log.error(
			`'An unexpected error occurred': ${(error as Error).message}`
		);
	}
}
