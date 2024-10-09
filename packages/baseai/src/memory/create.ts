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
					message: 'Description of the pipe',
					placeholder: defaultConfig.description
				}),
			useGitRepo: () =>
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

	let memoryFilesDir = '.';
	let fileExtensions: string[] = ['*'];

	if (memoryInfo.useGitRepo) {
		// Check if the current directory is a Git repository
		try {
			await execAsync('git rev-parse --is-inside-work-tree');
		} catch (error) {
			p.cancel('The current directory is not a Git repository.');
			process.exit(1);
		}

		memoryFilesDir = (await p.text({
			message:
				'Enter the path to the directory to track (relative to current directory):',
			validate: value => {
				if (!value.trim()) {
					return 'The path cannot be empty.';
				}
				const fullPath = path.resolve(process.cwd(), value);
				if (!fs.existsSync(fullPath)) {
					return 'The specified path does not exist.';
				}
				if (!fs.lstatSync(fullPath).isDirectory()) {
					return 'The specified path is not a directory.';
				}
				return;
			}
		})) as string;

		const extensionsInput = (await p.text({
			message:
				'Enter file extensions to track (use * for all, or comma-separated list, e.g., .md,.mdx):',
			validate: value => {
				if (value.trim() === '') {
					return 'Please enter at least one file extension or *';
				}
				if (value !== '*') {
					const extensions = value.split(',').map(ext => ext.trim());
					const invalidExtensions = extensions.filter(
						ext => !/^\.\w+$/.test(ext)
					);
					if (invalidExtensions.length > 0) {
						return `Invalid extension(s): ${invalidExtensions.join(', ')}. Extensions should start with a dot followed by alphanumeric characters.`;
					}
				}
				return;
			}
		})) as string;

		fileExtensions =
			extensionsInput === '*'
				? ['*']
				: extensionsInput.split(',').map(ext => ext.trim());
	}

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
import path from 'path';

const ${memoryNameCamelCase} = (): MemoryI => ({
  name: '${memoryNameSlugified}',
  description: '${memoryInfo.description || ''}',
  config: {
		useGitRepo: ${memoryInfo.useGitRepo},
		dirToTrack: path.posix.join(${memoryFilesDir
			.split(path.sep)
			.map(segment => `'${segment}'`)
			.join(', ')}),
		extToTrack: ${JSON.stringify(fileExtensions)}
  }
});

export default ${memoryNameCamelCase};
`;

	try {
		await fs.promises.mkdir(baseDir, { recursive: true });
		await fs.promises.mkdir(memoryDir, { recursive: true });
		await fs.promises.writeFile(filePath, memoryContent);
		await fs.promises.mkdir(dbDir, { recursive: true });
		await createDb(memoryNameSlugified);

		if (!memoryInfo.useGitRepo) {
			await fs.promises.mkdir(memoryDocumentsPath, { recursive: true });
			p.note(
				`Add documents in baseai/memory/${memoryNameSlugified}/${cyan(`documents`)} to use them in the memory.`
			);
		} else {
			const extensionsMsg = fileExtensions.includes('*')
				? 'all file types'
				: `files with extensions: ${cyan(fileExtensions.join(', '))}`;
			p.note(
				`All ${extensionsMsg} under ${cyan(memoryFilesDir)} will be tracked and used in the memory.`
			);
		}

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
