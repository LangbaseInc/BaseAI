import fs from 'fs/promises';
import path from 'path';
import * as p from '@clack/prompts';
import { memoryConfigSchema, type MemoryConfigI } from 'types/memory';

function extractConfigObject(fileContents: string): unknown {
	try {
		// Remove import statements and exports
		const cleanedContent = fileContents
			.replace(/import\s+.*?['"];?\s*/g, '')
			.replace(/export\s+default\s+/, '');

		// First try to match a function that returns an object directly with parentheses
		let match = cleanedContent.match(
			/(?:const\s+)?(\w+)\s*=\s*\(\s*\)\s*(?::\s*\w+)?\s*=>\s*\(({[\s\S]*?})\)/
		);

		// If no direct parentheses match, try to match function with return statement
		if (!match) {
			match = cleanedContent.match(
				/(?:const\s+)?(\w+)\s*=\s*\(\s*\)\s*(?::\s*\w+)?\s*=>\s*\{[\s\S]*?return\s+({[\s\S]*?})\s*;\s*\}/
			);
		}

		// If still no match, try to match direct object assignment
		if (!match) {
			match = cleanedContent.match(
				/(?:const\s+)?(?:memory|\w+)\s*=\s*({[\s\S]*?});?$/m
			);
		}

		if (!match) {
			throw new Error('Unable to find memory object definition');
		}

		// The object literal will be in the last capture group
		const memoryObjStr = match[match.length - 1];

		// Create a new Function that returns the object literal
		const fn = new Function(`return ${memoryObjStr}`);
		const memoryObj = fn();

		// Extract memory config properties
		const configObj: MemoryConfigI = {
			name: memoryObj.name,
			description: memoryObj.description,
			git: {
				enabled: memoryObj.git.enabled,
				include: memoryObj.git.include,
				gitignore: memoryObj.git.gitignore,
				deployedAt: memoryObj.git.deployedAt || '',
				embeddedAt: memoryObj.git.embeddedAt || ''
			}
		};

		return configObj;
	} catch (error) {
		console.error('Parsing error:', error);
		console.error('File contents:', fileContents);
		throw new Error(
			`Failed to extract config: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

export default async function loadMemoryConfig(
	memoryName: string
): Promise<MemoryConfigI> {
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
