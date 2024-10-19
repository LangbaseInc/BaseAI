import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import pipeMarketingCampaignTailoringAgent from './baseai/pipes/marketing-campaign-tailoring-agent';


const pipe = new Pipe(pipeMarketingCampaignTailoringAgent());

async function main() {

    const initialSpinner = ora('Connecting to marketing-campaign-tailoring-agent ...').start();
    try {
        const { completion: initialMctAgentResponse } = await pipe.run({
            messages: [{ role: 'user', content: 'Hello how can I user your services?' }],
        });
        initialSpinner.stop();
        console.log(chalk.cyan('Agent response...'));
        console.log(initialMctAgentResponse);
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
            const { completion: mctAgentResponse } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(mctAgentResponse);
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();