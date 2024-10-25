import {exec, spawn} from 'child_process';
import * as p from '@clack/prompts';

export async function startBaseAIDevServer() {
	const spinner = p.spinner();
	spinner.start('Starting AI server...');
	// Spawn the server process detached from the parent
	const serverProcess = spawn('npx', ['baseai', 'dev'], {
		// Detach the process so it runs independently
		detached: true,
		// Pipe stdout/stderr to files or ignore them
		stdio: 'ignore',
		shell: process.platform === 'win32',
	});

	// Unref the process so it won't keep the parent alive
	serverProcess.unref();

	// Wait a bit for the server to start
	return new Promise(resolve => {
		setTimeout(() => {
			spinner.stop('AI server started.');
			resolve(true);
		}, 2000);
	});
}
