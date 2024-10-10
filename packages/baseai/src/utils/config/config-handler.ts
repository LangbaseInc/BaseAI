import * as p from '@clack/prompts';
import { cosmiconfig } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import type { BaseAIConfig, EnvConfig } from 'types/config';

/**
 * Default configuration for BaseAI.
 */
export const defaultConfig: BaseAIConfig = {
	log: {
		// Enable or disable logging
		isEnabled: true,
		// Enable logging in production when NODE_ENV is set to production
		isEnabledInProd: false,
		logSensitiveData: false,
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		'pipe.request.prodOptions': false,
		'pipe.request.localOptions': false,
		tool: true,
		memory: true
	},
	memory: {
		useLocalEmbeddings: false
	},
	// Path to the .env file starting from the root of the project
	envFilePath: '.env',
	// Other default configuration options can be added here
	env: {} as EnvConfig
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
