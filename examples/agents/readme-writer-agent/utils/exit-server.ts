import * as p from '@clack/prompts';
import {spawn} from 'child_process';

export async function exitServer() {
	const spinner = p.spinner();
	spinner.start('Stopping AI server...');
	// Spawn the server process detached from the parent
	const serverProcess = spawn('npx', ['kill-port', '9000'], {
		// Detach the process so it runs independently
		detached: true,
		// Pipe stdout/stderr to files or ignore them
		stdio: 'ignore',
		shell: process.platform === 'win32',
	});

	// Unref the process so it won't keep the parent alive
	serverProcess.unref();
	spinner.stop('AI server stopped.');
}
