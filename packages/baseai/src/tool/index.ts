import { getAvailableTools } from '@/utils/get-available-tools';
import { heading } from '@/utils/heading';
import { isToolPresent } from '@/utils/is-tool-present';
import { formatCode } from '@/utils/ts-format-code';
import * as p from '@clack/prompts';
import slugify from '@sindresorhus/slugify';
import camelCase from 'camelcase';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { z } from 'zod';

const defaultTool = {
	type: 'function',
	function: {
		name: 'get_current_weather',
		description: 'Get the current weather in a given location',
		parameters: {
			type: 'object',
			properties: {
				location: {
					type: 'string',
					description: 'The city and state, e.g. San Francisco, CA'
				},
				unit: {
					type: 'string',
					enum: ['celsius', 'fahrenheit']
				}
			},
			required: ['location']
		}
	}
};

const toolNameSchema = z
	.string()
	.min(3, 'Tool name must be at least 3 characters long')
	.max(50, 'Tool name must not exceed 50 characters');

/**
 * Asynchronously creates a new tool by prompting the user for tool details,
 * validates the input, and generates a new tool file with the provided information.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the tool is created successfully.
 *
 * @throws Will throw an error if there is an issue creating the tool file.
 */
export async function createTool() {
	const allTools = await getAvailableTools();
	p.intro(heading({ text: 'TOOL', sub: 'Create a new tool' }));

	const toolInfo = await p.group(
		{
			name: () =>
				p.text({
					message: 'Name of the tool',
					placeholder: defaultTool.function.name,
					validate: value => {
						const result = toolNameSchema.safeParse(value);
						if (!result.success) {
							return result.error.issues[0].message;
						}

						const hasTool = isToolPresent({
							name: value,
							allTools
						});

						if (hasTool) {
							return `Tool with name ${value} already exists!`;
						}
						return;
					}
				}),
			description: () =>
				p.text({
					message: 'Description of the tool',
					placeholder: defaultTool.function.description,
					validate(value) {
						if (value.length === 0)
							return `Tool description is required!`;
					}
				})
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
		}
	);

	const slugifiedName = slugify(toolInfo.name);
	const camelCaseNameToolName = camelCase('tool-' + toolInfo.name);
	const camelCaseNameFnName = camelCase(toolInfo.name);
	const description = toolInfo.description || '';

	const toolContent = `import { ToolI } from '@baseai/core';

export async function ${camelCaseNameFnName}() {
	// Add your tool logic here
	// This function will be called when the tool is executed
}

const ${camelCaseNameToolName} = (): ToolI => ({
	run: ${camelCaseNameFnName},
	type: 'function' as const,
	function: {
		name: '${camelCaseNameToolName}',
		description: '${description}',
		parameters: {},
	},
});

export default ${camelCaseNameToolName};
`;

	const baseDir = path.join(process.cwd(), 'baseai', 'tools');
	const filePath = path.join(baseDir, `${slugifiedName}.ts`);
	const formattedCode = await formatCode(toolContent);

	try {
		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.writeFile(filePath, formattedCode);

		p.outro(
			heading({
				text: camelCaseNameToolName,
				sub: `created as a new tool \n ${color.dim(`${figures.pointer} ${filePath}`)}`,
				green: true
			})
		);
		process.exit(0);
	} catch (error: any) {
		p.cancel(`Error creating tool: ${error.message}`);
		process.exit(1);
	}
}
