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
			// Find the git block content
			const gitMatch = fileContents.match(/git:\s*{([^}]*?)}/);
			if (gitMatch) {
				const existingGitContent = gitMatch[1].trim();
				let newGitContent: string;

				// If embeddedAt exists, update it
				if (existingGitContent.includes('embeddedAt:')) {
					newGitContent = existingGitContent.replace(
						/(embeddedAt:\s*['"])([^'"]*)(['"])/,
						`$1${embeddedCommitHash}$3`
					);
				} else {
					// For empty or minimal content, just add embeddedAt
					if (!existingGitContent || existingGitContent === '') {
						newGitContent = `\n\t\tembeddedAt: '${embeddedCommitHash}'\n\t`;
					} else {
						// Add embeddedAt to existing content
						newGitContent =
							existingGitContent.replace(/,\s*$/, '') + // Remove trailing comma if exists
							`,\n\t\tembeddedAt: '${embeddedCommitHash}'`;
					}
				}

				// Replace the old git block with the new one
				fileContents = fileContents.replace(
					/git:\s*{[^}]*?}/,
					`git: {${newGitContent}}`
				);
			}
		} else {
			// Add new git config block
			const insertAfterUseGit = fileContents.replace(
				/(useGit:\s*true,?)(\s*\n)/,
				`$1\n\tgit: {\n\t\tembeddedAt: '${embeddedCommitHash}'\n\t},$2`
			);

			// Only update if the replacement was successful
			if (insertAfterUseGit !== fileContents) {
				fileContents = insertAfterUseGit;
			} else {
				throw new Error(
					'Could not find appropriate location to insert git config'
				);
			}
		}

		// Write the updated contents back to the file
		await fs.writeFile(indexFilePath, fileContents, 'utf-8');

		p.log.success(`Updated embeddedAt hash for memory '${memoryName}'.`);
	} catch (error) {
		console.error(`Error saving embeddedAt hash: ${error}`);
		throw error;
	}
}
