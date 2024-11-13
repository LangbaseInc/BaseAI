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

		// Check if the git config exists
		if (fileContents.includes('git:')) {
			// Check if embeddedAt exists in git config
			if (fileContents.match(/git:\s*{[^}]*embeddedAt:/)) {
				// Update existing embeddedAt
				fileContents = fileContents.replace(
					/(git:\s*{[^}]*embeddedAt:\s*['"])([^'"]*)/,
					`$1${embeddedCommitHash}`
				);
			} else {
				// Add embeddedAt to existing git config
				fileContents = fileContents.replace(
					/(git:\s*{)/,
					`$1\n        embeddedAt: '${embeddedCommitHash}',`
				);
			}
		} else {
			// Add entire git config with embeddedAt
			fileContents = fileContents.replace(
				/config:\s*{/,
				`config: {\n        git: {\n            embeddedAt: '${embeddedCommitHash}'\n        },`
			);
		}

		// Write the updated contents back to the file
		await fs.writeFile(indexFilePath, fileContents, 'utf-8');

		p.log.success(`Updated embeddedAt hash for memory '${memoryName}'.`);
	} catch (error) {
		console.error(`Error saving embeddedAt hash: ${error}`);
		throw error;
	}
}
