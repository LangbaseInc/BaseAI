import { cyan, dim, dimItalic, lineItem } from '@/utils/formatting';
import { getAvailableTools } from '@/utils/get-available-tools';
import { heading } from '@/utils/heading';
import { defaultRagPrompt } from '@/utils/memory/constants';
import { getAvailableMemories } from '@/utils/memory/get-available-memories';
import { formatCode } from '@/utils/ts-format-code';
import * as p from '@clack/prompts';
import slugify from '@sindresorhus/slugify';
import camelCase from 'camelcase';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

type PipeStatus = 'public' | 'private';

const pipeNameSchema = z
	.string()
	.min(3, 'Pipe name must be at least 3 characters long')
	.max(50, 'Pipe name must not exceed 50 characters')
	.regex(
		/^[a-zA-Z0-9.-]+$/,
		'Pipe name can only contain letters, numbers, dots, and hyphens'
	);

const multiselectHelper = `${dimItalic(`(optional)`)} \n${dimItalic(`${lineItem} Press ${cyan(`space`)} to select, ${cyan(`enter`)} to submit or skip`)}`;

export async function createPipe() {
	const tools = await getAvailableTools();
	const memories = await getAvailableMemories();
	const hasTools = tools.length > 0;
	const hasMemories = memories.length > 0;

	p.intro(heading({ text: 'PIPE', sub: 'Create a new agent pipe' }));

	const pipeInfo = await p.group(
		{
			name: () =>
				p.text({
					message: 'Name of the pipe',
					placeholder: 'AI Pipe Agent',
					validate: value => {
						const result = pipeNameSchema.safeParse(value);
						if (!result.success) {
							return result.error.issues[0].message;
						}
						return;
					}
				}),
			description: () =>
				p.text({
					message: 'Description of the pipe',
					placeholder: 'This is a test pipe'
				}),
			status: () =>
				p.select({
					message: 'Status of the pipe',
					options: [
						{ value: 'public', label: 'Public' },
						{ value: 'private', label: 'Private' }
					]
				}) as Promise<PipeStatus>,
			systemPrompt: () =>
				p.text({
					message: 'System prompt',
					placeholder: 'You are a helpful AI assistant.',
					initialValue: 'You are a helpful AI assistant.'
				}),
			...(hasMemories && {
				memory: async () =>
					p.multiselect({
						message: `Select memory for this pipe ${multiselectHelper}`,
						options: memories.map(memoryName => ({
							value: memoryName,
							label: memoryName
						})),
						required: false
					})
			}),
			...(hasTools && {
				tools: async () =>
					p.multiselect({
						message: `Select tools for this pipe ${multiselectHelper}`,
						options: tools.map(tool => ({
							value: tool,
							label: tool
						})),
						required: false
					})
			})
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
		}
	);

	let selectedTools = ``;
	let toolNames: string[] = [];

	// If the user selected tools, add them to the pipe content
	const pipeTools = pipeInfo.tools;
	if (pipeTools) {
		pipeTools.map(tool => {
			const name = `${camelCase(tool as string)}Tool`;
			toolNames.push(`${name}()`);
			selectedTools += `\nimport ${name} from '../tools/${tool}';`;
		});
	}

	let selectedMemories = ``;
	let selectedMemoriesNames: string[] = [];

	// If the user selected memories, add them to the pipe content
	const pipeMemories = pipeInfo.memory;
	if (pipeMemories) {
		pipeMemories.map(memory => {
			const name = `${camelCase(memory as string)}Memory`;
			selectedMemoriesNames.push(
				`${camelCase(memory as string)}Memory()`
			);
			selectedMemories += `\nimport ${name} from '../memory/${memory}';`;
		});
	}

	const isMemoryAttached = selectedMemoriesNames.length > 0;

	const pipeNameSlugified = slugify(pipeInfo.name);
	const pipeNameCamelCase = camelCase('pipe-' + pipeInfo.name);
	const pipeContent = `import { PipeI } from '@baseai/core';${selectedTools}${selectedMemories}

const ${pipeNameCamelCase} = (): PipeI => ({
    // Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
    name: '${pipeNameSlugified}',
    description: '${pipeInfo.description || ''}',
    status: '${pipeInfo.status}',
    model: 'openai:gpt-4o-mini',
    stream: true,
    json: false,
    store: true,
    moderate: true,
    top_p: 1,
    max_tokens: 1000,
    temperature: 0.7,
    presence_penalty: 1,
    frequency_penalty: 1,
    stop: [],
    tool_choice: 'auto',
    parallel_tool_calls: true,
    messages: [
        { role: 'system', content: \`${pipeInfo.systemPrompt}\` },
        ${
			isMemoryAttached
				? `{ role: 'system', name: 'rag', content: "${defaultRagPrompt.replace(/\n/g, '\\n')}" }`
				: ''
		}
    ],
    variables: [],
    memory: [${selectedMemoriesNames.join(', ')}],
    tools: [${toolNames.join(', ')}],
});

export default ${pipeNameCamelCase};
    `;

	const formattedCode = await formatCode(pipeContent);

	const baseDir = path.join(process.cwd(), 'baseai', 'pipes');
	const filePath = path.join(baseDir, `${pipeNameSlugified}.ts`);

	try {
		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.writeFile(filePath, formattedCode);
		p.outro(
			heading({
				text: pipeNameCamelCase,
				sub: `created as a new pipe \n ${dim(figures.pointer)} ${dimItalic(` ${filePath}`)}`,
				green: true
			})
		);
		process.exit(0);
	} catch (error: any) {
		p.cancel(`Error creating pipe: ${error.message}`);
		process.exit(1);
	}
}
