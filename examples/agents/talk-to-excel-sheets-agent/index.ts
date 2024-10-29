import 'dotenv/config';
import {Message, Pipe} from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeTalkToExcelAgent from './baseai/pipes/talk-to-excel-agent';


const pipe = new Pipe(pipeTalkToExcelAgent());

async function main() {
	const initialSpinner = ora(
		'Connecting to talk-to-excel-agent...',
	).start();
	// Messages array for keeping track of the conversation
	const messages: Message[] = [
		// Initial message to the agent
		{role: 'user', content: 'Please provide your initial analysis?'},
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
			const {completion: talkToExcelAgentResp} = await pipe.run({
				messages,
			});
			messages.push({
				role: 'assistant',
				content: talkToExcelAgentResp,
			});
			spinner.stop();
			console.log(chalk.cyan('Agent:'));
			console.log(talkToExcelAgentResp);
		} catch (error) {
			spinner.stop();
			console.error(chalk.red('Error processing your request:'), error);
		}
	}
}

main();
