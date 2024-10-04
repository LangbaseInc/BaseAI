import fs from 'fs/promises';
import * as p from '@clack/prompts';
import path from 'path';

export async function saveDeployedCommitHashInMemoryConfig({
	memoryName,
	deployedCommitHash
}: {
	memoryName: string;
	deployedCommitHash: string;
}): Promise<void> {
	try {
		const memoryDir = path.join(
			process.cwd(),
			'baseai',
			'memory',
			memoryName
		);
		const indexFilePath = path.join(memoryDir, 'index.ts');
		let fileContents = await fs.readFile(indexFilePath, 'utf-8');

		// Check if the deployedCommitHash already exists in the config
		if (fileContents.includes('deployedCommitHash:')) {
			// Update the existing deployedCommitHash
			fileContents = fileContents.replace(
				/deployedCommitHash:\s*['"].*['"]/,
				`deployedCommitHash: '${deployedCommitHash}'`
			);
		} else {
			// Add the deployedCommitHash to the config
			fileContents = fileContents.replace(
				/config:\s*{/,
				`config: {\n    deployedCommitHash: '${deployedCommitHash}',`
			);
		}

		// Write the updated contents back to the file
		await fs.writeFile(indexFilePath, fileContents, 'utf-8');

		p.log.success(`Updated deployedCommitHash for memory '${memoryName}'.`);
	} catch (error) {
		console.error(`Error saving latest commit hash: ${error}`);
		throw error;
	}
}
