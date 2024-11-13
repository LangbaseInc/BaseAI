import fs from 'fs/promises';
import path from 'path';
import * as p from '@clack/prompts';
import { memoryConfigSchema } from 'types/memory';

function extractConfigObject(fileContents: string): unknown {
	try {
		// Match everything between config: { and the closing }
		const match = fileContents.match(
			/config:\s*({[\s\S]*?})(?=,\s*\}|\s*\})/
		);
		if (!match) {
			throw new Error('Unable to find config object');
		}

		const configStr = match[1];

		// Create a new Function that returns the object literal
		const fn = new Function(`return ${configStr}`);
		return fn();
	} catch (error) {
		console.error('Parsing error:', error);
		console.error(
			'Matched config:',
			fileContents.match(/config:\s*({[\s\S]*?})(?=,\s*\}|\s*\})/)?.[1]
		);
		throw new Error(
			`Failed to extract config: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

export default async function loadMemoryConfig(memoryName: string) {
	try {
		const memoryDir = path.join(
			process.cwd(),
			'baseai',
			'memory',
			memoryName
		);
		const indexFilePath = path.join(memoryDir, 'index.ts');

		await fs.access(indexFilePath);
		const fileContents = await fs.readFile(indexFilePath, 'utf-8');
		const configObj = extractConfigObject(fileContents);

		return memoryConfigSchema.parse(configObj);
	} catch (error) {
		if (error instanceof Error) {
			p.cancel(`Failed to load memory '${memoryName}': ${error.message}`);
		} else {
			p.cancel(`Failed to load memory '${memoryName}': Unknown error`);
		}
		process.exit(1);
	}
}
