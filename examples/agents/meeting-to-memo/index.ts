import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeMeetingToMemoAgent from './baseai/pipes/meeting-to-memo-agent';


const pipe = new Pipe(pipeMeetingToMemoAgent());

async function main() {

    const initialSpinner = ora('Checking attached content type...').start();
    try {
        const { completion: initialReportAgentResponse } = await pipe.run({
            messages: [{ role: 'user', content: 'Check if the attached document in CONTEXT can be styled in memo, \
                if yes then respond the about the extracted memo date and one line summary' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Memo Agent response...'));
        console.log(initialReportAgentResponse);
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
            const { completion: memoAgentResponse } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(memoAgentResponse);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();