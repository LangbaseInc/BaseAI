const fs = require('fs');

function getPath(type) {
	return [
		`${process.cwd()}/src/app/${type}/[section]/page.tsx`,
		`${process.cwd()}/src/app/${type}/[section]/[slug]/page.tsx`
	];
}

async function main() {
	const runTime = `export const runtime = 'edge';\n\n`;

	getPath('docs').forEach(async path => {
		const docContent = fs.readFileSync(path, 'utf-8');

		await fs.promises.writeFile(path, docContent.replace(runTime, ''));
	});

	getPath('learn').forEach(async path => {
		const learnContent = fs.readFileSync(path, 'utf-8');
		await fs.promises.writeFile(path, learnContent.replace(runTime, ''));
	});
}

main();
