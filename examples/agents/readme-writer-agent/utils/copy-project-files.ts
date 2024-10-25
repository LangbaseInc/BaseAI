import * as p from '@clack/prompts';
import path from 'path';
import {execAsync} from './exec-sync';
import {handleError} from './handle-error';

export async function copyProjectFiles() {
	const spinner = p.spinner();
	spinner.start('Copying project files...');

	const source = process.cwd();
	const destination = path.join(
		__dirname,
		'baseai',
		'memory',
		'code-files',
		'documents',
	);

	try {
		await execAsync(`rm -rf ${destination}`);
		await execAsync(`mkdir -p ${destination}`);
		await execAsync(`cp -r ${source} ${destination}`);
		spinner.stop('Project files copied successfully.');
	} catch (error) {
		handleError({spinner, error});
	}
}
