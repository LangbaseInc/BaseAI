const {execSync} = require('child_process');
const path = require('path');

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

// Get the current commit short SHA
const SHORT_SHA = execSync('git rev-parse --short HEAD').toString().trim();

console.log('Creating snapshot release...');

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
