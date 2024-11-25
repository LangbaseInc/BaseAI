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
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const defaultConfig = {
	name: 'ai-agent-memory',
	description: 'My list of docs as memory for an AI agent pipe'
};

const MEMORY_CONSTANTS = {
	documentsDir: 'documents'
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
						const validatedName = memoryNameSchema.safeParse(value);
						if (!validatedName.success) {
							const validationError = fromZodError(
								validatedName.error
							).toString();
							return validationError;
						}
						return;
					}
				}),
			description: () =>
				p.text({
					message: 'Description of the memory',
					placeholder: defaultConfig.description
				}),
			useGit: () =>
				p.confirm({
					message:
						'Do you want to create memory from current project git repository?',
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

	const memoryNameSlugified = slugify(memoryInfo.name);
	const memoryNameCamelCase = camelCase('memory-' + memoryNameSlugified);
	const baseDir = path.join(process.cwd(), 'baseai', 'memory');
	const memoryDir = path.join(baseDir, memoryNameSlugified);
	const filePath = path.join(memoryDir, 'index.ts');
	const dbDir = path.join(process.cwd(), '.baseai', 'db');

	if (memoryInfo.useGit) {
		try {
			await execAsync('git rev-parse --is-inside-work-tree');
		} catch (error) {
			p.cancel('The current directory is not a Git repository.');
			process.exit(1);
		}
	}

	const memoryContent = `import {MemoryI} from '@baseai/core';

const ${memoryNameCamelCase} = (): MemoryI => ({
	name: '${memoryNameSlugified}',
	description: ${JSON.stringify(memoryInfo.description || '')},
	git: {
		enabled: ${memoryInfo.useGit},${
			memoryInfo.useGit
				? `
		include: ['**/*'],
		gitignore: true,`
				: `
		include: ['${MEMORY_CONSTANTS.documentsDir}/**/*'],
		gitignore: false,`
		}
		deployedAt: '',
		embeddedAt: ''
	}
});

export default ${memoryNameCamelCase};`;

	try {
		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.mkdir(memoryDir, { recursive: true });
		await fs.promises.writeFile(filePath, memoryContent);
		await fs.promises.mkdir(dbDir, { recursive: true });

		if (!memoryInfo.useGit) {
			const memoryDocumentsPath = path.join(
				memoryDir,
				MEMORY_CONSTANTS.documentsDir
			);
			await fs.promises.mkdir(memoryDocumentsPath, { recursive: true });
			p.note(
				`Add documents in baseai/memory/${memoryNameSlugified}/${cyan(`documents`)} to use them in the memory.`
			);
		} else {
			p.note(
				[
					'All files in this Git repository will be tracked by default.',
					'',
					`To modify which files are being tracked, update the config at:`,
					cyan(filePath)
				].join('\n')
			);
		}

		await createDb(memoryNameSlugified);

		p.outro(
			heading({
				text: memoryNameCamelCase,
				sub: `created as a new memory \n ${dim(figures.pointer)} ${dimItalic(` ${filePath}`)}`,
				green: true
			})
		);
		process.exit(0);
	} catch (error: any) {
		p.cancel(`Error creating memory: ${error.message}`);
		process.exit(1);
	}
}
