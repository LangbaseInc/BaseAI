import fs from 'fs/promises';
import path from 'path';
import * as p from '@clack/prompts';
import { memoryConfigSchema, type MemoryConfigI } from 'types/memory';

function parseConfig(configString: string): MemoryConfigI {
	// Remove all whitespace that's not inside quotes
	const cleanConfig = configString.replace(
		/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/g,
		''
	);

	const useGitRepoMatch = cleanConfig.match(/useGitRepo:(true|false)/);
	const includeMatch = cleanConfig.match(/include:['"](.+?)['"]/);
	const extensionsMatch = cleanConfig.match(/extensions:(\[.*?\])/);
	const deployedCommitHashMatch = cleanConfig.match(
		/deployedCommitHash:['"](.+?)['"]/
	);
	const embeddedCommitHashMatch = cleanConfig.match(
		/embeddedCommitHash:['"](.+?)['"]/
	);

	if (!useGitRepoMatch || !includeMatch || !extensionsMatch) {
		throw new Error('Unable to parse config structure');
	}

	const useGitRepo = useGitRepoMatch[1] === 'true';
	const include = path.resolve(process.cwd(), includeMatch[1]);
	const extensions = JSON.parse(extensionsMatch[1].replace(/'/g, '"'));
	const deployedCommitHash = deployedCommitHashMatch
		? deployedCommitHashMatch[1]
		: undefined;
	const embeddedCommitHash = embeddedCommitHashMatch
		? embeddedCommitHashMatch[1]
		: undefined;

	const config: MemoryConfigI = {
		useGitRepo,
		include,
		extensions
	};

	if (deployedCommitHash) {
		config.deployedCommitHash = deployedCommitHash;
	}

	if (embeddedCommitHash) {
		config.embeddedCommitHash = embeddedCommitHash;
	}

	// Validate the parsed config against the schema
	const result = memoryConfigSchema.safeParse(config);
	if (!result.success) {
		throw new Error(`Invalid config: ${result.error.message}`);
	}

	return config;
}

export default async function loadMemoryConfig(
	memoryName: string
): Promise<MemoryConfigI | null> {
	try {
		const memoryDir = path.join(
			process.cwd(),
			'baseai',
			'memory',
			memoryName
		);
		const indexFilePath = path.join(memoryDir, 'index.ts');

		// Check if the directory exists
		await fs.access(memoryDir);

		// Check if the index.ts file exists
		await fs.access(indexFilePath);

		// Read the file contents
		const fileContents = await fs.readFile(indexFilePath, 'utf-8');

		// Extract the config object, allowing for any amount of whitespace
		const configMatch = fileContents.match(/config\s*:\s*({[\s\S]*?})/);
		if (!configMatch) {
			return null;
		}

		// Parse the config
		try {
			const config = parseConfig(configMatch[1]);
			return config;
		} catch (error) {
			if (error instanceof Error) {
				p.cancel(
					`Unable to read config in '${memoryName}/index.ts': ${error.message}`
				);
			} else {
				p.cancel(
					`Unable to read config in '${memoryName}/index.ts': Unknown error occurred`
				);
			}
			process.exit(1);
		}
	} catch (error) {
		if (error instanceof Error) {
			p.cancel(
				`Memory '${memoryName}' does not exist or could not be loaded: ${error.message}`
			);
		} else {
			p.cancel(
				`Memory '${memoryName}' does not exist or could not be loaded: Unknown error occurred`
			);
		}
		process.exit(1);
	}
}
