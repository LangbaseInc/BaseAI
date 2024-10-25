import * as p from '@clack/prompts';
import {execAsync} from './exec-sync';
import {handleError} from './handle-error';

export async function generateEmbeddings({dirName}: {dirName: string}) {
	const spinner = p.spinner();
	spinner.start('Understanding your project codebase...');

	try {
		await execAsync(`npx baseai@latest embed -m code-files`, {
			cwd: dirName,
		});

		spinner.stop('Developed understanding of your project codebase.');
	} catch (error) {
		handleError({spinner, error});
	}
}
