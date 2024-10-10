import fs from 'fs/promises';
import * as p from '@clack/prompts';
import path from 'path';

export async function saveEmbeddedCommitHashInMemoryConfig({
	memoryName,
	embeddedCommitHash
}: {
	memoryName: string;
	embeddedCommitHash: string;
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

		// Check if the embeddedCommitHash already exists in the config
		if (fileContents.includes('embeddedCommitHash:')) {
			// Update the existing embeddedCommitHash
			fileContents = fileContents.replace(
				/embeddedCommitHash:\s*['"].*['"]/,
				`embeddedCommitHash: '${embeddedCommitHash}'`
			);
		} else {
			// Add the embeddedCommitHash to the config
			fileContents = fileContents.replace(
				/config:\s*{/,
				`config: {\n    embeddedCommitHash: '${embeddedCommitHash}',`
			);
		}

		// Write the updated contents back to the file
		await fs.writeFile(indexFilePath, fileContents, 'utf-8');

		p.log.success(`Updated embeddedCommitHash for memory '${memoryName}'.`);
	} catch (error) {
		console.error(`Error saving latest commit hash: ${error}`);
		throw error;
	}
}
