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

process.exit(0);
run('pnpm build:pkgs');

// Create snapshot version
run(`pnpm changeset version --snapshot ${SHORT_SHA}`);

run(
	'pnpm clean-examples && pnpm install --no-frozen-lockfile --filter=./packages/* --filter=./tools/*',
);

run(
	'turbo clean && pnpm i && turbo build --filter=./packages/* --filter=./tools/*',
);

// Publish snapshot
run('pnpm changeset publish --no-git-tag --tag snapshot');

console.log('Snapshot release complete!');
