import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { findUpSync } from 'find-up';
import fs from 'fs';

export default async ({ clear = false }) => {
	unhandled();

	const pkgJsonPath = findUpSync('package.json');

	if (!pkgJsonPath) {
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
