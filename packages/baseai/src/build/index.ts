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
	const outputPath = path.join(process.cwd(), '.baseai/pipes');

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
	const outputPath = path.join(process.cwd(), '.baseai/tools');

	const builtTools = await buildTypeScriptFiles(
		sourcePath,
		outputPath,
		'tools'
	);
	listBuiltItems('Tools', builtTools, icons.tool);
};

const buildMemory = async () => {
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

	await fs.mkdir(outputPath, { recursive: true });

	const filesBaseDir = await fs.readdir(sourcePath);
	const files = filesBaseDir.map(file => `${file}/index.ts`);
	const tsFiles = files.filter(file => file.endsWith('.ts'));

	if (tsFiles.length === 0) {
		p.log.info('MEMORY: No index.ts file found. Skipping memory build.');
		return;
	}

	const s = p.spinner();
	s.start('Building memory');

	const builtMemories: string[] = [];

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
