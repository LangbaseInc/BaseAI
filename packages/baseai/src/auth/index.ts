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
import Conf from 'conf';
import fs from 'fs';
import open from 'open';
import path from 'path';
import color from 'picocolors';

const config = new Conf({
	projectName: 'baseai'
});

interface Account {
	login: string;
	apiKey: string;
}

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

	// Store in Conf (old functionality)
	const newAccount: Account = { login, apiKey };
	const existingAccounts = (config.get('accounts') as Account[]) || [];
	const updatedAccounts = [...existingAccounts, newAccount];
	config.set('accounts', updatedAccounts);

	// Store in .env file (new functionality)
	// const envKeyName = apiKey.startsWith('user_')
	// 	? 'LANGBASE_USER_API_KEY'
	// 	: 'LANGBASE_ORG_API_KEY';

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

	fs.appendFileSync(path.join(process.cwd(), envFile), envContent);

	outro(
		color.green(
			`Authentication successful. Credentials stored in config and ${envFile}`
		)
	);
	console.log(color.dim(`Config file location: ${config.path}`));
	process.exit(0);
}

export function getStoredAuth(): Account | undefined {
	const accounts = (config.get('accounts') as Account[]) || [];
	const currentLogin = config.get('currentAccount') as string | undefined;

	if (currentLogin) {
		return accounts.find(account => account.login === currentLogin);
	}

	return accounts[0]; // Return the first account if no current account is set
}

export function getStoredAccounts(): Account[] {
	return (config.get('accounts') as Account[]) || [];
}

export function setCurrentAccount(login: string): boolean {
	const accounts = getStoredAccounts();
	if (accounts.some(account => account.login === login)) {
		config.set('currentAccount', login);
		return true;
	}
	return false;
}
