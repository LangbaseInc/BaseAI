import { execSync } from 'child_process';
import path from 'path';

/**
 * Get changed files between two Git commits
 * @param {Object} options - The options for the function
 * @param {string} options.oldCommit - The old already deployed commit (default: 'HEAD~1')
 * @param {string} options.latestCommit - The latest commit to deploy (default: 'HEAD')
 * @param {string} options.repoPath - The path to the Git repository (default: process.cwd())
 * @param {string[]} options.extensions - Array of file extensions to filter (default: all files)
 * @param {boolean} options.includeUntracked - Whether to include untracked files (default: false)
 * @returns {Promise<string[]>} - Array of changed file paths
 */
export async function getChangedFilesBetweenCommits({
	oldCommit = 'HEAD~1',
	latestCommit = 'HEAD',
	extensions = []
}: {
	oldCommit: string;
	latestCommit: string;

	extensions: string[];
}): Promise<string[]> {
	try {
		// Validate inputs
		if (typeof oldCommit !== 'string' || typeof latestCommit !== 'string') {
			throw new Error('Invalid commit references');
		}

		const repoPath = process.cwd();

		// Construct the Git command
		let command = `git diff --name-only ${oldCommit} ${latestCommit}`;

		// if (includeUntracked) {
		// 	command += ' && git ls-files --others --exclude-standard';
		// }

		// Execute the Git command
		const result = execSync(command, {
			encoding: 'utf-8',
			cwd: repoPath
		}).trim();

		// Process the result
		let changedFiles = result.split('\n').filter(Boolean);

		// Filter by extensions if provided
		if (extensions.length > 0) {
			changedFiles = changedFiles.filter(file =>
				extensions.some(ext => file.endsWith(ext))
			);
		}

		// Resolve full paths
		changedFiles = changedFiles.map(file => path.resolve(repoPath, file));

		return changedFiles;
	} catch (error) {
		console.error('Error executing Git command:', error);
		throw error;
	}
}
