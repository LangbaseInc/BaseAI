import type {BaseAIConfig} from 'baseai';

export const config: BaseAIConfig = {
	log: {
		isEnabled: true,
		isEnabledInProd: true,
		logSensitiveData: false,
		pipe: true,
		tool: true,
		memory: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		'pipe.request.prodOptions': false,
		'pipe.request.localOptions': false,
	},
	memory: {
		useLocalEmbeddings: false,
	},
	envFilePath: '.env',
};
