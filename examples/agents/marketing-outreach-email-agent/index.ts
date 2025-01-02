import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeMarketingOutreachEmailAgent from './baseai/pipes/marketing-outreach-email-agent';


const pipe = new Pipe(pipeMarketingOutreachEmailAgent());

async function main() {

    const initialSpinner = ora('Connecting with marketing-outreach-email-agent ...').start();
    try {
        const { completion: initialMarketingEmailAgent } = await pipe.run({
            messages: [{ role: 'user', content: 'How can I use your services, give me an example from Fundraising segment?' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Agent response...'));
        console.log(initialMarketingEmailAgent);
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
            const { completion: marketingEmailAgent } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(marketingEmailAgent);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();