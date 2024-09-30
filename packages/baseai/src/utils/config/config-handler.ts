import * as p from '@clack/prompts';
import { cosmiconfig } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import type { BaseAIConfig } from 'types/config';

export const defaultConfig: BaseAIConfig = {
	log: {
		// Enable or disable logging
		isEnabled: true,
		// Log sensitive data
		logSensitiveData: false,
		// Toggle specific log categories
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		tool: true,
		memory: true
	},
	memory: {
		useLocalEmbeddings: false
	},
	envFilePath: '.env'
	// Other default configuration options can be added here
};

export async function loadConfig(): Promise<BaseAIConfig> {
	const explorer = cosmiconfig('baseai', {
		searchPlaces: ['baseai/baseai.config.ts'],
		loaders: {
			'.ts': TypeScriptLoader()
		}
	});
	try {
		let result = await explorer.search();
		if (!result) {
			// throw new Error('No config file found');
			p.cancel('Failed to create config file');
			process.exit(1);
		}

		// BaseAI config is expected to be in the config key of the config file
		const config = result.config.config;
		if (config) {
			return {
				...defaultConfig,
				...config,
				log: {
					...defaultConfig.log,
					...config.log
				}
			};
		}
	} catch (error) {
		// console.log(error);
		p.cancel('Error: Unable to load config file');
		process.exit(1);
	}
	return defaultConfig;
}
