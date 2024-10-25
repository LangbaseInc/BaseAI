import 'dotenv/config';
import pkgJson from './package.json';
import {init} from './utils/init';
import {questions} from './utils/questions';
import {startBaseAIDevServer} from './utils/start-baseai-server';
import {copyProjectFiles} from './utils/copy-project-files';
import {generateReadme} from './utils/generate-readme';
import {killServer} from './utils/kill-server';
import {exit} from './utils/exit';
import {generateEmbeddings} from './utils/generate-embeddings';

async function main() {
	init({
		title: `readme-writer-agent`,
		tagLine: `by Saad Irfan`,
		description: pkgJson.description,
		version: pkgJson.version,
		clear: true,
	});

	const {level} = await questions();
	await startBaseAIDevServer();
	await copyProjectFiles();
	await generateEmbeddings();
	const {path} = await generateReadme({level});

	await killServer();
	exit({path});
}

main();
