import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeBusinessRequirementsAndSummarizationAgent from './baseai/pipes/business-requirements-and-summarization-agent';


const pipe = new Pipe(pipeBusinessRequirementsAndSummarizationAgent());

async function main() {

    const initialSpinner = ora('Starting conversation with BusinessRequirementsAndSummarizationAgent...').start();
    try {
        const { completion: initialRequirementsAgentResponse } = await pipe.run({
            messages: [{ role: 'user', content: 'Tell me how to interact with you?' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Agent response...'));
        console.log(initialRequirementsAgentResponse);
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
            const { completion: businessRequirementsAgentResponse } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(businessRequirementsAgentResponse);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();