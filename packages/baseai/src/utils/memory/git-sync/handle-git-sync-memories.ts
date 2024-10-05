import { execSync } from 'child_process';
import * as p from '@clack/prompts';
import path from 'path';
import fs from 'fs/promises';
import { saveDeployedCommitHashInMemoryConfig } from './save-deployed-commit-in-config';
import { getChangedFilesBetweenCommits } from './get-changed-files-between-commits';
import type { MemoryConfigI } from 'types/memory';

export async function handleGitSyncMemories({
	memoryName,
	config
}: {
	memoryName: string;
	config: MemoryConfigI;
}): Promise<string[]> {
	// Check for uncommitted changes
	try {
		execSync('git diff-index --quiet HEAD --');
	} catch (error) {
		p.log.error(
			`There are uncommitted changes in the Git repository for deploying git-synced memory "${memoryName}".`
		);
		p.log.info(
			'Please commit these changes before deploying. Aborting deployment.'
		);
		process.exit(1);
	}

	const repoPath = process.cwd();
	const fullDirToTrack = path.join(repoPath, config.dirToTrack);
	let filesToDeploy: string[] = [];

	if (!config.deployedCommitHash) {
		// If there's no deployedCommitHash, return all files in the dirToTrack
		filesToDeploy = await getAllFilesInDirectory({
			dir: fullDirToTrack,
			extensions: config.extToTrack
		});
		p.log.info(
			`Found no previous deployed commit. Deploying all ${filesToDeploy.length} files in memory "${memoryName}":`
		);
	} else {
		filesToDeploy = await getChangedFilesBetweenCommits({
			oldCommit: config.deployedCommitHash,
			latestCommit: 'HEAD',
			dirToTrack: config.dirToTrack,
			extensions: config.extToTrack
		});

		if (filesToDeploy.length > 0) {
			p.log.info(
				`Found ${filesToDeploy.length} changed files for memory "${memoryName}":`
			);

			// Print the changed file names TODO: Remove because it may clutter the terminal?
			filesToDeploy.forEach(file => p.log.message(file));
		} else {
			p.log.info(
				`No changes detected for memory "${memoryName}" since last deployment.`
			);
		}

		if (filesToDeploy.length === 0) {
			return filesToDeploy;
		}
	}

	// Update deployedCommitHash in memory config
	const currentCommitHash = execSync('git rev-parse HEAD').toString().trim();
	await saveDeployedCommitHashInMemoryConfig({
		memoryName,
		deployedCommitHash: currentCommitHash
	});

	return filesToDeploy;
}

async function getAllFilesInDirectory({
	dir,
	extensions = []
}: {
	dir: string;
	extensions: string[];
}): Promise<string[]> {
	const files = await fs.readdir(dir, { withFileTypes: true });
	const result: string[] = [];

	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory()) {
			result.push(
				...(await getAllFilesInDirectory({ dir: fullPath, extensions }))
			);
		} else if (
			extensions.length === 0 ||
			extensions.some(ext => file.name.endsWith(ext))
		) {
			result.push(fullPath);
		}
	}

	return result;
}
