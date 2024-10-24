import 'dotenv/config';
import {Message, Pipe} from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeItSystemsTriageAgent from './baseai/pipes/it-systems-triage-agent';

const pipe = new Pipe(pipeItSystemsTriageAgent());

async function main() {
	const initialSpinner = ora(
		'Connecting to it-systems-triage-agent...',
	).start();
	// Messages array for keeping track of the conversation
	const messages: Message[] = [
		// Initial message to the agent
		{role: 'user', content: 'Hello how can I use your services?'},
	];

	try {
		const {completion} = await pipe.run({
			messages,
		});

		// Add the agent response to the messages array
		messages.push({role: 'assistant', content: completion});

		initialSpinner.stop();
		console.log(chalk.cyan('Agent response...'));
		console.log(completion);
	} catch (error) {
		initialSpinner.stop();
		console.error(chalk.red('Error processing initial request:'), error);
	}

	while (true) {
		const {userMsg} = await inquirer.prompt([
			{
				type: 'input',
				name: 'userMsg',
				message: chalk.blue(
					'Enter your query (or type "exit" to quit):',
				),
			},
		]);

		if (userMsg.toLowerCase() === 'exit') {
			console.log(chalk.green('Goodbye!'));
			break;
		}

		const spinner = ora('Processing your request...').start();
		messages.push({role: 'user', content: userMsg});
		try {
			const {completion: itSystemsTriageAgentResponse} = await pipe.run({
				messages,
			});
			messages.push({
				role: 'assistant',
				content: itSystemsTriageAgentResponse,
			});
			spinner.stop();
			console.log(chalk.cyan('Agent:'));
			console.log(itSystemsTriageAgentResponse);
		} catch (error) {
			spinner.stop();
			console.error(chalk.red('Error processing your request:'), error);
		}
	}
}

main();
