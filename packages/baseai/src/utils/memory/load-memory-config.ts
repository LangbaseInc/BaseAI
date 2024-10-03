import fs from 'fs/promises';
import path from 'path';
import * as p from '@clack/prompts';
import type { MemoryConfigI } from 'types/memory';

function parsePathJoin(joinArgs: string): string {
	// Remove any quotes, split by comma, and trim each argument
	const args = joinArgs
		.split(',')
		.map(arg => arg.trim().replace(/['"]/g, ''));
	// Join all arguments to preserve the complete path
	return path.join(...args);
}

function parseConfig(configString: string): MemoryConfigI {
	// Remove all whitespace that's not inside quotes
	const cleanConfig = configString.replace(
		/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/g,
		''
	);

	const useGitRepoMatch = cleanConfig.match(/useGitRepo:(true|false)/);
	const dirToTrackMatch = cleanConfig.match(
		/dirToTrack:(?:path\.(?:posix\.)?join\((.*?)\)|['"](.+?)['"])/
	);
	const extToTrackMatch = cleanConfig.match(/extToTrack:(\[.*?\])/);

	if (!useGitRepoMatch || !dirToTrackMatch || !extToTrackMatch) {
		throw new Error('Unable to parse config structure');
	}

	const useGitRepo = useGitRepoMatch[1] === 'true';
	const dirToTrack = dirToTrackMatch[2]
		? dirToTrackMatch[2]
		: parsePathJoin(dirToTrackMatch[1]);
	const extToTrack = JSON.parse(extToTrackMatch[1].replace(/'/g, '"'));

	return {
		useGitRepo,
		dirToTrack,
		extToTrack
	};
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
		} catch (parseError) {
			p.cancel(`Unable to read config in '${memoryName}/index.ts'.`);
			process.exit(1);
		}
	} catch (error) {
		p.cancel(
			`Memory '${memoryName}' does not exist or could not be loaded.`
		);
		process.exit(1);
	}
}
