import 'dotenv/config';
import {Message, Pipe} from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeHumanInTheLoopSupportAgent from './baseai/pipes/human-in-the-loop-support-agent';

const pipe = new Pipe(pipeHumanInTheLoopSupportAgent());

async function main() {
	// Messages array for keeping track of the conversation
	const messages: Message[] = [];

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
			const {completion} = await pipe.run({
				messages,
			});
			messages.push({
				role: 'assistant',
				content: completion,
			});
			spinner.stop();
			console.log(chalk.cyan('Agent:'));
			console.log(completion);
		} catch (error) {
			spinner.stop();
			console.error(chalk.red('Error processing your request:'), error);
		}
	}
}

main();
