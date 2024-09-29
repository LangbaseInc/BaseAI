import { cyan, dim, dimItalic } from '@/utils/formatting';
import { heading } from '@/utils/heading';
import { createDb } from '@/utils/memory/db/lib';
import * as p from '@clack/prompts';
import slugify from '@sindresorhus/slugify';
import camelCase from 'camelcase';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { memoryNameSchema } from 'types/memory';
import { fromZodError } from 'zod-validation-error';

const defaultConfig = {
	name: 'ai-agent-memory',
	description: 'My list of docs for an AI agent pipe'
};

const MEMORY_CONSTANTS = {
	documentsDir: 'documents' // Path to store documents
};

export async function createMemory() {
	p.intro(heading({ text: 'MEMORY', sub: 'Create a new memory' }));

	const memoryInfo = await p.group(
		{
			name: () =>
				p.text({
					message: 'Name of the memory',
					placeholder: defaultConfig.name,
					validate: value => {
						// Validate the memory name
						const validatedName = memoryNameSchema.safeParse(value);
						// If validation fails, return the error message
						if (!validatedName.success) {
							// Convert the Zod error to a human-readable string
							const valdiationError = fromZodError(
								validatedName.error
							).toString();
							// Return the error messages
							return valdiationError;
						}
						return;
					}
				}),
			description: () =>
				p.text({
					message: 'Description of the pipe',
					placeholder: defaultConfig.description
				})
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
		}
	);

	const memoryNameSlugified = slugify(memoryInfo.name);
	const memoryNameCamelCase = camelCase('memory-' + memoryNameSlugified);

	const baseDir = path.join(process.cwd(), 'baseai', 'memory');
	const memoryDir = path.join(baseDir, memoryNameSlugified);
	const filePath = path.join(memoryDir, 'index.ts');
	const memoryDocumentsPath = path.join(
		memoryDir,
		MEMORY_CONSTANTS.documentsDir
	);
	const dbDir = path.join(process.cwd(), '.baseai', 'db');

	const memoryContent = `import { MemoryI } from '@baseai/core';

const ${memoryNameCamelCase} = (): MemoryI => ({
	name: '${memoryNameSlugified}',
	description: '${memoryInfo.description || ''}',
});

export default ${memoryNameCamelCase};
`;

	try {
		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.mkdir(memoryDir, { recursive: true });
		await fs.promises.writeFile(filePath, memoryContent);
		await fs.promises.mkdir(dbDir, { recursive: true });
		await createDb(memoryNameSlugified);
		await fs.promises.mkdir(memoryDocumentsPath, { recursive: true });
		p.note(
			`Add documents in baseai/memory/${memoryNameSlugified}/${cyan(`documents`)} to use them in the memory.`
		);

		p.outro(
			heading({
				text: memoryNameCamelCase,
				sub: `created as a new pipe \n ${dim(figures.pointer)} ${dimItalic(` ${filePath}`)}`,
				green: true
			})
		);
		process.exit(0);
	} catch (error: any) {
		p.cancel(`Error creating memory: ${error.message}`);
		process.exit(1);
	}
}
