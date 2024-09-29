#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { addPipe } from './add';
import { auth } from './auth';
import build from './build';
import { deploy } from './deploy';
import { runBaseServer } from './dev';
import { init } from './init';
import { createMemory } from './memory/create';
import { embedMemory } from './memory/embed';
import { embedDoc } from './memory/embed-doc';
import { listMemory } from './memory/list';
import { retrieveMemory } from './memory/retrieve';
import { createPipe } from './pipe';
import { createTool } from './tool';
import cli from './utils/cli';
import { loadConfig } from './utils/config/config-handler';
import { setLocalEmbeddingsConfig } from './utils/config/set-local-embeddings';
import debugMode from './utils/debug-mode';
import cliInit from './utils/init';
import { initLogger } from './utils/logger-utils';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

// Utility function to check if a command is present
const command = (cmd: string): boolean => input.includes(cmd);

// Utility function to check if a flag is present
const flag = (flg: string): boolean => Boolean(flags[flg]);

(async () => {
	await cliInit({ clear });
	if (debug) debugMode(cli);

	// Make sure baseai is initialized
	debug && console.log('Checking if baseai is initialized');
	command('init')
		? await init({ calledAsCommand: true, debug })
		: await init({ calledAsCommand: false, debug });

	// Envs.
	const config = await loadConfig();
	dotenv.config({ path: path.resolve(process.cwd(), config.envFilePath) });

	debug && console.log('Initializing logger');
	await initLogger();

	if (command('help')) {
		showHelp(0);
	}

	if (command('auth')) {
		await auth();
	}

	if (command('dev')) {
		await runBaseServer();
	}

	if (command('pipe')) {
		await createPipe();
	}

	if (command('tool')) {
		await createTool();
	}

	if (command('build')) {
		await build({ calledAsCommand: true });
	}

	if (command('deploy')) {
		await deploy({
			overwrite: flags.overwrite
		});
	}

	if (command('memory') && flag('list')) {
		await listMemory();
	}

	if (command('memory') && !flag('list')) {
		await createMemory();
	}

	if (command('embed') && flag('document')) {
		await embedDoc({
			memoryName: flags.memory,
			documentName: flags.document,
			overwrite: flags.overwrite
		});
	}

	if (command('embed') && !flag('document')) {
		await embedMemory({
			memoryName: flags.memory,
			overwrite: flags.overwrite
		});
	}

	if (command('retrieve')) {
		await retrieveMemory({ memory: flags.memory, query: flags.query });
	}

	if (command('config') && command('embeddings')) {
		await setLocalEmbeddingsConfig(flags.local);
	}

	// Add | Clone | Install
	if (
		command('add') ||
		command('a') ||
		command('clone') ||
		command('install') ||
		command('i')
	) {
		// `baseai add login/pipe` so destructing the second one.
		const [_, loginAndPipe] = input;
		await addPipe({ loginAndPipe });
	}
})();

// Types.
export * from 'types/config';
