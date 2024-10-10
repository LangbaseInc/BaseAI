import { execSync } from 'child_process';

/**
 * Retrieves a list of files that have changed between two Git commits within a specified directory.
 *
 * @param {Object} options - The options for the function.
 * @param {string} options.oldCommit - The old commit reference to compare from.
 * @param {string} [options.latestCommit='HEAD'] - The latest commit reference to compare to. Defaults to 'HEAD'.
 * @param {string} options.dirToTrack - The directory to track for changes.
 * @returns {Promise<string[]>} A promise that resolves to an array of changed file paths.
 * @throws Will throw an error if the Git command fails or if the oldCommit is an empty string.
 */
export async function getChangedFilesBetweenCommits({
	oldCommit,
	latestCommit = 'HEAD',
	dirToTrack
}: {
	oldCommit: string;
	latestCommit: string;
	dirToTrack: string;
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
