import { heading } from '@/utils/heading';
import icons from '@/utils/icons';
import * as p from '@clack/prompts';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function build({ calledAsCommand }: { calledAsCommand?: boolean }) {
	try {
		calledAsCommand &&
			p.intro(heading({ text: 'BUILDING', sub: 'baseai...' }));

		await buildPipes();
		await buildTools();
		await buildMemory();

		console.log('');
		p.outro(heading({ text: 'BUILD', sub: 'complete', green: true }));
	} catch (error) {
		p.log.error('Build failed');
		throw error;
	}
}

export default build;

const buildPipes = async () => {
	console.log('');
	p.intro(heading({ text: 'PIPES', sub: '', dim: true }));

	const sourcePath = path.join(process.cwd(), 'baseai', 'pipes');
	const outputPath = path.join(process.cwd(), '.baseai', 'pipes');

	const builtPipes = await buildTypeScriptFiles(
		sourcePath,
		outputPath,
		'pipes'
	);
	listBuiltItems('Pipes', builtPipes, icons.pipe);
};

const buildTools = async () => {
	console.log('');
	p.intro(heading({ text: 'TOOLS', sub: '', dim: true }));

	const sourcePath = path.join(process.cwd(), 'baseai', 'tools');
	const outputPath = path.join(process.cwd(), '.baseai', 'tools');

	const builtTools = await buildTypeScriptFiles(
		sourcePath,
		outputPath,
		'tools'
	);
	listBuiltItems('Tools', builtTools, icons.tool);
};

export const buildMemory = async ({
	memoryName
}: { memoryName?: string } = {}) => {
	console.log('');
	p.intro(heading({ text: 'MEMORY', sub: '', dim: true }));

	const sourcePath = path.join(process.cwd(), 'baseai', 'memory');
	const outputPath = path.join(process.cwd(), '.baseai', 'memory');

	try {
		await fs.access(sourcePath);
	} catch (error) {
		p.log.info('No memory directory found. Skipping memory build.');
		return;
	}

	try {
		await fs.access(outputPath);
	} catch (error) {
		// Create the build memory directory if it doesn't exist
		await fs.mkdir(outputPath, { recursive: true });
	}

	const builtMemories: string[] = [];
	const s = p.spinner();
	let tsFiles: string[] = [];

	// If a memoryName is provided, build only that memory
	if (memoryName) {
		tsFiles = await getSingleMemoryFile({ sourcePath, memoryName });
	}

	// If no memoryName is provided, build all memories
	if (!memoryName) {
		tsFiles = await getAllMemoryFile(sourcePath);

		if (tsFiles.length === 0) {
			p.log.info(
				'MEMORY: No index.ts file found. Skipping memory build.'
			);
			return;
		}
	}

	s.start('Building memory');

	for (const file of tsFiles) {
		const inputFile = path.join(sourcePath, file);
		const outputFile = path.join(outputPath, `${path.dirname(file)}.json`);
		const displayName = path.dirname(file); // This is the last directory name
		try {
			const { stdout } = await execAsync(
				`npx tsx -e "import memoryConfig from '${inputFile}'; console.log(JSON.stringify(memoryConfig()))"`
			);

			await fs.writeFile(outputFile, stdout);
			s.message(`Compiled ${displayName}`);
			builtMemories.push(displayName);
		} catch (error) {
			s.stop(`Error compiling ${displayName}: ${error}`);
		}
	}

	s.stop('Build complete');
	listBuiltItems('Memories', builtMemories, icons.memory);
};

const buildTypeScriptFiles = async (
	sourcePath: string,
	outputPath: string,
	type: string
): Promise<string[]> => {
	try {
		await fs.access(sourcePath);
	} catch (error) {
		p.log.info(`No ${type} directory found. Skipping ${type} build.`);
		return [];
	}

	await fs.mkdir(outputPath, { recursive: true });

	const files = await fs.readdir(sourcePath);
	const tsFiles = files.filter(file => file.endsWith('.ts'));

	if (tsFiles.length === 0) {
		p.log.info(
			`No .ts files found in the ${type} directory. Skipping ${type} build.`
		);
		return [];
	}

	const s = p.spinner();
	s.start(`Building ${type}`);

	const builtItems: string[] = [];

	for (const file of tsFiles) {
		const inputFile = path.join(sourcePath, file);
		const outputFile = path.join(outputPath, file.replace('.ts', '.json'));
		const displayName = path.parse(file).name; // File name without extension

		try {
			const { stdout } = await execAsync(
				`npx tsx -e "import config from '${inputFile}'; console.log(JSON.stringify(config()))"`
			);

			// Parse the JSON output
			let configObject = JSON.parse(stdout);

			// Remove the apiKey if it exists
			if ('apiKey' in configObject) {
				delete configObject.apiKey;
			}

			// Stringify the modified object back to JSON
			const modifiedOutput = JSON.stringify(configObject, null, 2);

			await fs.writeFile(outputFile, modifiedOutput);
			s.message(`Compiled ${displayName}`);
			builtItems.push(displayName);
		} catch (error) {
			s.stop(`Error compiling ${displayName}: ${error}`);
		}
	}

	s.stop(`Build complete`);
	return builtItems;
};

const listBuiltItems = (title: string, items: string[], icon: string) => {
	if (items.length > 0) {
		items.forEach(item => {
			console.log(`${icon}  ${item}`);
		});
	} else {
		// console.log(`\nNo ${title.toLowerCase()} were built.`);
	}
};

async function getSingleMemoryFile({
	sourcePath,
	memoryName
}: {
	sourcePath: string;
	memoryName: string;
}) {
	// Array to store the paths of the memory files
	const tsFiles: string[] = [];

	const memoryPath = path.join(sourcePath, memoryName);

	// Get all files in the memory directory
	const files = await fs.readdir(memoryPath);
	const indexFile = files.find(file => file === 'index.ts');

	// If no index.ts file is found, no memory entry file exists. Skip the build.
	if (!indexFile) {
		p.log.info('MEMORY: No index.ts file found. Skipping memory build.');
		process.exit(1); // Exiting process because it is a single memory build.
	}

	tsFiles.push(path.join(memoryName, indexFile));

	return tsFiles;
}

async function getAllMemoryFile(sourcePath: string) {
	// Array to store the paths of the memory files
	let tsFiles: string[] = [];

	// Get all folders in the memory directory
	const filesBaseDir = await fs.readdir(sourcePath);

	// Get only folders in the memory directory
	const folderPromises = filesBaseDir.map(async file => {
		const filePath = path.join(sourcePath, file);
		const stats = await fs.stat(filePath);
		return stats.isDirectory() ? file : '';
	});

	let allMemoryFolders = await Promise.all(folderPromises);

	// Remove empty strings from the array
	allMemoryFolders = allMemoryFolders.filter(folder => folder !== '');

	if (allMemoryFolders.length === 0) {
		p.log.info('MEMORY: No memory found. Skipping memory build.');
		return [];
	}

	// Get all index.ts files in the all the memory folders
	const tsFilesPromise = allMemoryFolders.map(async memory => {
		const filePath = path.join(sourcePath, memory);
		const files = await fs.readdir(filePath);
		const indexFile = files.find(file => file === 'index.ts');

		// if index file, return the memory/index.ts path
		return indexFile ? path.join(memory, indexFile) : '';
	});

	// Wait for all the promises to resolve
	tsFiles = await Promise.all(tsFilesPromise);

	// Remove empty strings from the array
	tsFiles = tsFiles.filter(file => file !== '');

	return tsFiles;
}
