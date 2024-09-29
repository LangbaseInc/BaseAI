/**
 * `changeset version` updates the version and adds a changelog file in
 * the example apps, but we don't want to do that. So this script reverts
 * any "version" field changes and deletes the `CHANGELOG.md` file.
 *
 * Source: https://github.com/TooTallNate/nx.js/blob/main/.github/scripts/cleanup-examples.mjs
 */

import {readdirSync, readFileSync, statSync, unlinkSync} from 'node:fs';
import {join} from 'path';
import {fileURLToPath} from 'url';

// Get the root package.json version
const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const baseaiVersion = rootPackageJson.version;

const examplesUrl = new URL('../../examples', import.meta.url);
const examplesDir = fileURLToPath(examplesUrl);

console.log('Updating and cleaning up examples...', examplesDir);

for (const app of readdirSync(examplesDir)) {
	const appPath = join(examplesDir, app);
	if (statSync(appPath).isDirectory()) {
		// Update baseai version in example app
		// const packageJsonPath = join(appPath, 'package.json');
		// const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

		// if (packageJson.dependencies && packageJson.dependencies.baseai) {
		// 	packageJson.dependencies.baseai = `^${baseaiVersion}`;
		// 	writeFileSync(
		// 		packageJsonPath,
		// 		JSON.stringify(packageJson, null, 2) + '\n',
		// 	);
		// 	console.log(`Updated ${app} to use baseai@^${baseaiVersion}`);
		// }

		// Delete CHANGELOG.md if it exists
		try {
			const changelogPath = join(appPath, 'CHANGELOG.md');
			unlinkSync(changelogPath);
			console.log(`Deleted CHANGELOG.md in ${app}`);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}
}

import {execSync} from 'child_process';

console.log('Cleaning up uncommitted changes in examples...', examplesDir);

try {
	// Reset any changes in the examples directory
	execSync('git checkout -- examples', {stdio: 'inherit'});
	console.log('Reset changes in examples directory');

	// Remove untracked files and directories in the examples directory
	// execSync('git clean -fd examples', {stdio: 'inherit'});
	// console.log(
	// 	'Removed untracked files and directories in examples directory',
	// );

	console.log(
		'Cleanup complete. All uncommitted changes in examples directory have been removed.',
	);
} catch (error) {
	console.error('An error occurred during cleanup:', error.message);
	process.exit(1);
}
