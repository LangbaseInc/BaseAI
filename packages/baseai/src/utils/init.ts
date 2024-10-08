import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export default async ({ clear = false }) => {
	unhandled();

	// Get the directory of the current module
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Go up two levels to find the package.json
	const pkgJsonPath = path.join(__dirname, '..', 'package.json');

	if (!fs.existsSync(pkgJsonPath)) {
		console.error('Unable to find package.json');
		process.exit(1);
	}

	const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

	await welcome({
		title: `baseai`,
		tagLine: `by Langbase`,
		description: pkgJson.description,
		version: pkgJson.version,
		bgColor: '#A699EA',
		color: '#000000',
		bold: true,
		clear
	});
};
