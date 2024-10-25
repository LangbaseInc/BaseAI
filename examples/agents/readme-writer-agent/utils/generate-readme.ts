import {getRunner, getTextContent, Pipe} from '@baseai/core';
import {handleError} from './handle-error';
import pipeReadmeWriter from '../baseai/pipes/readme-writer';
import path from 'path';
import fs from 'fs';
import * as p from '@clack/prompts';
import {execAsync} from './exec-sync';

export async function generateReadme({level}: {level: string}) {
	const spinner = p.spinner();
	spinner.start('AI is thinking...');

	try {
		const pipe = new Pipe(pipeReadmeWriter());
		let readmeContent = '';

		const {stream} = await pipe.run({
			messages: [
				{
					role: 'user',
					content:
						'Generate a carefully tailored readme that contains all the necessary information to get started with the project.',
				},
			],
			variables: [{name: 'level', value: level}],
			stream: true,
		});

		// Convert the stream to a stream runner.
		const runner = getRunner(stream);
		spinner.stop(`Let's write the readme docs...`);

		const readmePath = path.join(process.cwd(), 'readme.md');

		const hasReadme = fs.existsSync(readmePath);
		if (hasReadme) {
			await execAsync(`rm ${readmePath}`);
		}

		spinner.start('Writing readme docs in project readme.md file...');

		for await (const chunk of runner) {
			const textPart = getTextContent(chunk);
			readmeContent += textPart;
			fs.writeFileSync(readmePath, readmeContent);
		}

		spinner.stop('Readme docs written successfully.');
		return {content: readmeContent, path: readmePath};
	} catch (error) {
		handleError({spinner, error});
		process.exit(1);
	}
}
