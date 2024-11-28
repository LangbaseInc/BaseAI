import { loadConfig } from './config/config-handler';
import fs from 'fs/promises';
import * as p from '@clack/prompts';
import color from 'picocolors';

export interface Account {
	apiKey: string;
}

type Spinner = ReturnType<typeof p.spinner>;

function handleNoAccountFound({ spinner }: { spinner: Spinner }): void {
	spinner.stop('No account found');
	p.log.warn('No account found. Please authenticate first.');
	p.log.info(`Run: ${color.green('npx baseai auth')}`);
}
function handleAuthError({
	spinner,
	error
}: {
	spinner: Spinner;
	error: unknown;
}): void {
	spinner.stop('Failed to retrieve authentication');
	p.log.error(`Error retrieving stored auth: ${(error as Error).message}`);
}

export async function retrieveAuthentication({
	spinner
}: {
	spinner: Spinner;
}): Promise<Account | null> {
	spinner.start('Retrieving stored authentication');
	try {
		const baiConfig = await loadConfig();
		let envFile = baiConfig.envFilePath || '.env';
		const envFileContent = await fs.readFile(envFile, 'utf-8');

		const apiKey = envFileContent
			.split('\n')
			.reverse()
			.find(line => line.includes('LANGBASE_API_KEY='))
			?.split('=')[1];

		if (!apiKey) {
			handleNoAccountFound({ spinner });
			return null;
		}

		spinner.stop('Retrieved stored authentication');

		return {
			apiKey
		};
	} catch (error) {
		handleAuthError({ spinner, error });
		return null;
	}
}
