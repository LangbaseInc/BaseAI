import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeReportGeneratorAgent from './baseai/pipes/report-generator-agent';

const pipe = new Pipe(pipeReportGeneratorAgent());

async function main() {

    const initialSpinner = ora('Checking attached content type...').start();
    try {
        const { completion: initialReportAgentResponse } = await pipe.run({
            messages: [{ role: 'user', content: 'Summarize the content in 3 lines and present 10 important keywords\
                present in the attached document found in the CONTEXT' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Report Generator Agent response...'));
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
            const { completion: reportAgentResponse } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(reportAgentResponse);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();