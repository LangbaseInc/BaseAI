import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeAgileUserStoriesAgent from './baseai/pipes/agile-user-stories-agent';


const pipe = new Pipe(pipeAgileUserStoriesAgent());

async function main() {

    const initialSpinner = ora('Connecting to agile user stories agent...').start();
    try {
        const { completion: initialUserStoriesAgentReps } = await pipe.run({
            messages: [{ role: 'user', content: 'Let me know how to use your services?' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('User Stories Agent response...'));
        console.log(initialUserStoriesAgentReps);
    } catch (error) {
        initialSpinner.stop();
        console.error(chalk.red('Error processing initial request:'), error);
    }

    while (true) {
        const { userMsg } = await inquirer.prompt([
            {
                type: 'input',
                name: 'userMsg',
                message: chalk.blue('Enter your query (or type "exit" to quit):'),
            },
        ]);

        if (userMsg.toLowerCase() === 'exit') {
            console.log(chalk.green('Goodbye!'));
            break;
        }

        const spinner = ora('Processing your request...').start();

        try {
            const { completion: userStoriesAgentResp } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(userStoriesAgentResp);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();