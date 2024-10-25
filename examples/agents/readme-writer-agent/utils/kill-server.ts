import * as p from '@clack/prompts';
import {execAsync} from './exec-sync';

export async function killServer() {
	const spinner = p.spinner();
	spinner.start('Stopping AI server...');
	await execAsync('npx kill-port 9000');
	spinner.stop('AI server stopped.');
}
