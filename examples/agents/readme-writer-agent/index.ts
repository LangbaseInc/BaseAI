import 'dotenv/config';
import pkgJson from './package.json';
import chalk from 'chalk';
import clearConsole from 'clear-any-console';
import * as p from '@clack/prompts';
import pipeReadmeWriter from './baseai/pipes/readme-writer';
import {Pipe} from '@baseai/core';
import {getRunner} from '@baseai/core';

function init({clear, title, version, tagLine, description}) {
	const bg = chalk.hex('#6CC644').inverse.bold;
	const clr = chalk.hex(`#000000`).bold;
	clear && clearConsole();

	console.log();
	console.log(
		`${clr(`${bg(` ${title} `)}`)} v${version} ${chalk.dim(tagLine)}\n${chalk.dim(
			description,
		)}`,
	);
	console.log();
}

async function initialQueries() {
	const toolInfo = await p.group(
		{
			level: () =>
				p.select({
					message:
						'Choose the level of detail you want in the README.',
					options: [
						{label: 'Simple', value: 'simple' as unknown as any},
						{
							label: 'Detailed',
							value: 'detailed' as unknown as any,
						},
					],
				}),
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			},
		},
	);

	return {level: toolInfo.level};
}

type Spinner = ReturnType<typeof p.spinner>;

async function generateReadme({
	spinner,
	level,
}: {
	spinner: Spinner;
	level: string;
}) {
	spinner.start('AI is thinking...');
	try {
		const pipe = new Pipe(pipeReadmeWriter());

		const {stream} = await pipe.run({
			messages: [
				{
					role: 'user',
					content: 'Generate a README',
				},
			],
			variables: [{name: 'level', value: level}],
			stream: true,
		});

		// Convert the stream to a stream runner.
		const runner = getRunner(stream);

		// Method 1: Using event listeners
		runner.on('connect', () => {
			spinner.message('Generating README...');
		});

		runner.on('content', content => {
			process.stdout.write(content);
		});

		runner.on('end', () => {
			console.log('\nStream ended.');
		});

		runner.on('error', error => {
			console.error('Error:', error);
		});
	} catch (error) {}
}

async function main() {
	init({
		title: `readme-writer-agent`,
		tagLine: `by Saad Irfan`,
		description: pkgJson.description,
		version: pkgJson.version,
		clear: true,
	});

	const {level} = await initialQueries();

	const spinner = p.spinner();
}

main();
