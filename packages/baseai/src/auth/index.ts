import { loadConfig } from '@/utils/config/config-handler';
import { heading } from '@/utils/heading';
import * as p from '@clack/prompts';
import {
	cancel,
	confirm,
	isCancel,
	note,
	outro,
	password
} from '@clack/prompts';
import fs from 'fs/promises';
import open from 'open';
import path from 'path';
import color from 'picocolors';

export async function auth() {
	p.intro(
		heading({
			text: 'Langbase Authentication',
			sub: 'Auth by logging in to Langbase and getting your API key'
		})
	);

	const shouldOpen = await confirm({
		message: `Open the authentication page? ${color.dim(`— copy your API key from there and paste it here.`)}`
	});

	if (isCancel(shouldOpen)) {
		cancel('Operation cancelled.');
		process.exit(0);
	}

	if (shouldOpen) {
		await open('https://langbase.com/settings/api');

		note(
			color.yellow(
				'Please copy your API key from the opened page and paste it here.'
			)
		);
	}

	const apiKeyString = await password({
		message: 'Paste your API key string:',
		mask: '*'
	});

	if (isCancel(apiKeyString)) {
		cancel('Operation cancelled.');
		process.exit(0);
	}

	const [login, apiKey] = (apiKeyString as string).split(':');

	if (!login || !apiKey) {
		outro(
			color.red(
				'Invalid API key string. It should be in the format login:apiKey, when copied from https://langbase.com/settings/api it should be in the correct format.'
			)
		);
		process.exit(1);
	}

	const envKeyName = 'LANGBASE_API_KEY';
	const envContent = `\n# Langbase API key for https://langbase.com/${login}\n${envKeyName}=${apiKey}\n\n`;

	// TODO: Do we need this now?
	// const envFiles = ['.env', '.env.local', '.dev.vars'];
	// let envFile = envFiles.find(file =>
	// 	fs.existsSync(path.join(process.cwd(), file))
	// );

	// if (!envFile) {
	// 	envFile = '.env';
	// }

	const baiConfig = await loadConfig();
	let envFile = baiConfig.envFilePath || '.env';

	const envFileContent = await fs.readFile(envFile, 'utf-8');

	const oldKey = envFileContent
		.split('\n')
		.reverse() // Reverse to get the latest key if there are multiple
		.find(line => line.includes('LANGBASE_API_KEY'))
		?.split('=')[1];

	if (oldKey) {
		const shouldOverwrite = await confirm({
			message: `API key found in ${envFile}. Overwrite?`
		});

		if (isCancel(shouldOverwrite)) {
			cancel('Operation cancelled.');
			process.exit(0);
		}

		if (!shouldOverwrite) {
			outro(
				color.yellow('API key is not overwritten.')
			);
			process.exit(0);
		}

		const newEnvContent = envFileContent.replace(
			new RegExp(`LANGBASE_API_KEY=${oldKey}`),
			envContent.trim()
		);

		await fs.writeFile(path.join(process.cwd(), envFile), newEnvContent);
	} else {
		await fs.appendFile(path.join(process.cwd(), envFile), envContent);
	}

	outro(
		color.green(
			`Authentication successful. API key is stored in ${envFile}`
		)
	);
	process.exit(0);
}
