/**
 * This script creates a snapshot release by performing the following steps:
 * 1. Ensures the script is running from the project root directory.
 * 2. Defines a function to execute shell commands and log their output.
 * 3. Defines a function to update the version in a given package.json file.
 *    - If the current version is already a snapshot, it increments the snapshot number.
 *    - If the current version is not a snapshot, it increments the patch version and sets the snapshot number to 0.
 * 4. Retrieves the current commit short SHA.
 * 5. Bumps the version in the specified package.json files.
 * 6. Runs a series of commands to version, build, and publish the packages as a snapshot release.
 *
 * @requires child_process
 * @requires path
 * @requires fs
 */
const {execSync} = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure we're in the project root
process.chdir(path.resolve(__dirname, '../..'));

// Function to execute commands and log output
function run(command) {
	console.log(`Running: ${command}`);
	try {
		execSync(command, {stdio: 'inherit'});
	} catch (error) {
		console.error(`Error executing command: ${command}`);
		console.error(error);
		process.exit(1);
	}
}

// Function to update version in package.json
function bumpVersion(packagePath) {
	const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
	const currentVersion = pkg.version;
	let [major, minor, patch, snapshot] = currentVersion
		.split(/[-.]/)
		.map(v => (isNaN(parseInt(v)) ? v : parseInt(v)));

	if (snapshot === 'snapshot') {
		// If already a snapshot, increment the snapshot number
		snapshot = parseInt(pkg.version.split('-snapshot.')[1]) + 1;
	} else {
		// If not a snapshot, increment patch and set snapshot to 0
		patch += 1;
		snapshot = 0;
	}

	pkg.version = `${major}.${minor}.${patch}-snapshot.${snapshot}`;
	fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
	console.log(`Updated ${packagePath} to version ${pkg.version}`);
}

// Get the current commit short SHA
const SHORT_SHA = execSync('git rev-parse --short HEAD').toString().trim();

console.log('Creating snapshot release...');

// Bump versions
bumpVersion('./packages/baseai/package.json');
bumpVersion('./packages/core/package.json');

// Version and tag the snapshot release
run(`pnpm changeset version --snapshot ${SHORT_SHA}`);

// Build and publish the snapshot release
run('pnpm build:pkgs');
run('pnpm changeset publish --no-git-tag --tag snapshot');

// Reset Git changes
console.log('Git commit and push changes...');
run('git add . && git commit -m "📦 NEW: snapshot release" && git push');

console.log('All changes have been reset. Snapshot release process complete!');
