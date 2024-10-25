#!/usr/bin/env node
import 'dotenv/config';
import {init} from './utils/init';
import {questions} from './utils/questions';
import {startBaseAIDevServer} from './utils/start-baseai-server';
import {copyProjectFiles} from './utils/copy-project-files';
import {generateReadme} from './utils/generate-readme';
import {exitServer} from './utils/exit-server';
import {exit} from './utils/exit';
import {generateEmbeddings} from './utils/generate-embeddings';
import {dirName} from './utils/get-dirname';
import {askOpenAIKey} from './utils/ask-openai-key';

(async function () {
	// Show the welcome message
	init({
		title: `readme-writer-agent`,
		tagLine: `by Saad Irfan`,
		description: `An AI agent to help you write README files for open-source projects.`,
		version: `0.1.0`,
		clear: true,
	});

	// Ask for the OpenAI key if it doesn't exist
	await askOpenAIKey({dirName});

	// Ask for the readme level
	const {level} = await questions();

	// Start the baseAI server
	await startBaseAIDevServer();

	// Copy project files in the memory
	await copyProjectFiles({dirName});

	// Generate embeddings
	await generateEmbeddings({dirName});

	// Generate the readme
	const {path} = await generateReadme({level});

	// Exit the baseAI server
	await exitServer();

	// Exit the process
	exit({path});
})();
