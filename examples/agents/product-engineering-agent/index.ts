import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeProductEngineeringAgent from './baseai/pipes/product-engineering-agent';

const pipe = new Pipe(pipeProductEngineeringAgent());

async function main() {

    const initialSpinner = ora('Checking attached product data...').start();
    try {
        const { completion: initialProductEngAgentResponse } = await pipe.run({
            messages: [{ role: 'user', content: 'I have attached document in the CONTEXT, proceed with your analysis' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Product Engineering Agent response...'));
        console.log(initialProductEngAgentResponse);
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
            const { completion: productEngAgentResponse } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(productEngAgentResponse);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();