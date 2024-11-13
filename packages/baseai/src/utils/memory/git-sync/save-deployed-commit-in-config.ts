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

		// Check if the git config exists
		if (fileContents.includes('git:')) {
			// Check if deployedAt exists in git config
			if (fileContents.match(/git:\s*{[^}]*deployedAt:/)) {
				// Update existing deployedAt
				fileContents = fileContents.replace(
					/(git:\s*{[^}]*deployedAt:\s*['"])([^'"]*)/,
					`$1${deployedCommitHash}`
				);
			} else {
				// Add deployedAt to existing git config
				fileContents = fileContents.replace(
					/(git:\s*{)/,
					`$1\n        deployedAt: '${deployedCommitHash}',`
				);
			}
		} else {
			// Add entire git config with deployedAt
			fileContents = fileContents.replace(
				/config:\s*{/,
				`config: {\n        git: {\n            deployedAt: '${deployedCommitHash}'\n        },`
			);
		}

		// Write the updated contents back to the file
		await fs.writeFile(indexFilePath, fileContents, 'utf-8');

		p.log.success(`Updated deployedAt hash for memory '${memoryName}'.`);
	} catch (error) {
		console.error(`Error saving deployedAt hash: ${error}`);
		throw error;
	}
}
