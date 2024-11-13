import { execSync } from 'child_process';

/**
 * Retrieves the list of changed and deleted files between two Git commits matching specified glob patterns.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.oldCommit - The old commit reference to compare from.
 * @param {string} [params.latestCommit='HEAD'] - The latest commit reference to compare to. Defaults to 'HEAD'.
 * @param {string[]} params.include - Array of glob patterns to track for changes.
 * @returns {Promise<{ changedFiles: string[]; deletedFiles: string[] }>} - A promise that resolves to an object containing arrays of changed and deleted files.
 * @throws {Error} - Throws an error if the Git command execution fails or if the commit references are invalid.
 */
export async function getChangedAndDeletedFilesBetweenCommits({
	oldCommit,
	latestCommit = 'HEAD',
	include
}: {
	oldCommit: string;
	latestCommit: string;
	include: string[];
}): Promise<{ changedFiles: string[]; deletedFiles: string[] }> {
	try {
		// Validate inputs
		if (oldCommit === '') {
			throw new Error('Invalid commit references');
		}

		if (!Array.isArray(include) || include.length === 0) {
			throw new Error('Include patterns must be a non-empty array');
		}

		const repoPath = process.cwd();

		// Execute the Git commands for changed and deleted files
		const changedResult = execSync(
			constructGitCommand({
				include,
				oldCommit,
				diffFilter: 'ACMRT',
				latestCommit
			}),
			{
				encoding: 'utf-8',
				cwd: repoPath
			}
		).trim();

		const deletedResult = execSync(
			constructGitCommand({
				include,
				oldCommit,
				diffFilter: 'D',
				latestCommit
			}),
			{
				encoding: 'utf-8',
				cwd: repoPath
			}
		).trim();

		// Process the results
		const changedFiles = changedResult
			? changedResult
					.split('\n')
					.filter(Boolean)
					.map(file => file.replace(/\//g, '-'))
			: [];

		const deletedFiles = deletedResult
			? deletedResult
					.split('\n')
					.filter(Boolean)
					.map(file => file.replace(/\//g, '-'))
			: [];

		return { changedFiles, deletedFiles };
	} catch (error) {
		console.error('Error executing Git command:', error);
		throw error;
	}
}

// Helper function to construct the Git command for changed files
const constructGitCommand = ({
	include,
	oldCommit,
	diffFilter,
	latestCommit
}: {
	include: string[];
	oldCommit: string;
	diffFilter: 'ACMRT' | 'D';
	latestCommit: string;
}) => {
	const baseCommand = `git diff --diff-filter=${diffFilter} --name-only ${oldCommit} ${latestCommit}`;

	// If there's only one pattern, use it directly
	if (include.length === 1) {
		return `${baseCommand} -- "${include[0]}"`;
	}

	// For multiple patterns, use brace expansion
	const patterns = include.map(pattern => `"${pattern}"`).join(' ');
	return `${baseCommand} -- ${patterns}`;
};
