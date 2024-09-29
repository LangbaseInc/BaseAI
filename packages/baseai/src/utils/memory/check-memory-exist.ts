import * as p from '@clack/prompts';
import fs from 'fs/promises';
import path from 'path';

export const checkMemoryExists = async (memoryName: string) => {
	const memoryDir = path.join(process.cwd(), 'baseai', 'memory', memoryName);
	const indexFilePath = path.join(memoryDir, 'index.ts');

	try {
		await fs.access(memoryDir);
	} catch (error) {
		p.cancel(`Memory '${memoryName}' does not exist.`);
		process.exit(1);
	}

	try {
		await fs.access(indexFilePath);
	} catch (error) {
		p.cancel(
			`Index file for memory '${memoryName}/index.ts' does not exist.`
		);
		process.exit(1);
	}

	return true;
};
