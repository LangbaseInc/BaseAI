import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examplesDir = path.join(__dirname, '..', '..', 'examples');

function installDependencies(packageDir) {
	console.log(`Installing dependencies in ${packageDir}`);
	try {
		execSync('pnpm i -D baseai@latest', {
			cwd: packageDir,
			stdio: 'inherit',
		});
		execSync('pnpm i @baseai/core@latest', {
			cwd: packageDir,
			stdio: 'inherit',
		});
		console.log(`Successfully installed dependencies in ${packageDir}`);
	} catch (error) {
		console.error(
			`Error installing dependencies in ${packageDir}:`,
			error.message,
		);
	}
}

function processExamples() {
	if (!fs.existsSync(examplesDir)) {
		console.error('Examples directory not found');
		return;
	}

	const entries = fs.readdirSync(examplesDir, {withFileTypes: true});

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const packageDir = path.join(examplesDir, entry.name);
			const packageJsonPath = path.join(packageDir, 'package.json');

			if (fs.existsSync(packageJsonPath)) {
				installDependencies(packageDir);
			} else {
				console.log(`Skipping ${entry.name}: No package.json found`);
			}
		}
	}
}

processExamples();
