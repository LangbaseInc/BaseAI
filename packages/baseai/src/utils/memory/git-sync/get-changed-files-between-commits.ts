import { execSync } from 'child_process';
import path from 'path';

/**
 * Get changed files between two Git commits
 * @param {Object} options - The options for the function
 * @param {string} options.oldCommit - The old already deployed commit
 * @param {string} options.latestCommit - The latest commit to deploy (default: 'HEAD')
 * @param {string} options.repoPath - The path to the Git repository (default: process.cwd())
 * @param {string[]} options.extensions - Array of file extensions to filter (default: all files)
 * @param {boolean} options.includeUntracked - Whether to include untracked files (default: false)
 * @returns {Promise<string[]>} - Array of changed file paths
 */
export async function getChangedFilesBetweenCommits({
	oldCommit,
	latestCommit = 'HEAD',
	dirToTrack,
	extensions = []
}: {
	oldCommit: string;
	latestCommit: string;
	dirToTrack: string;
	extensions: string[];
}): Promise<string[]> {
	try {
		// Validate inputs
		if (oldCommit === '') {
			throw new Error('Invalid commit references');
		}

		const repoPath = process.cwd();

		// Construct the Git command to get changed files in the specific directory
		let command = `git diff --name-only ${oldCommit} ${latestCommit} -- ${dirToTrack}`;

		// Execute the Git command
		const result = execSync(command, {
			encoding: 'utf-8',
			cwd: repoPath
		}).trim();

		// Process the result
		let changedFiles = result.split('\n').filter(Boolean);

		// Resolve full paths
		changedFiles = changedFiles.map(file => file.replace(/\//g, '-'));

		return changedFiles;
	} catch (error) {
		console.error('Error executing Git command:', error);
		throw error;
	}
}
