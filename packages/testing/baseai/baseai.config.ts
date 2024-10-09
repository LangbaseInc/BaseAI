import type {BaseAIConfig} from 'baseai';

export const config: BaseAIConfig = {
	log: {
		isEnabled: true,
		isEnabledInProd: true,
		logSensitiveData: false,
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		'pipe.request.prodOptions': false,
		'pipe.request.localOptions': false,
		tool: false,
		memory: false,
	},
	memory: {
		useLocalEmbeddings: false,
	},
	envFilePath: '.env',
	env: {
		NODE_ENV: 'production',
		LANGBASE_API_KEY: process.env.LANGBASE_API_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
};
