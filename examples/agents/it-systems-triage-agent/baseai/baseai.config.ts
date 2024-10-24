import type {BaseAIConfig} from 'baseai';

export const config: BaseAIConfig = {
	log: {
		isEnabled: false,
		logSensitiveData: false,
		pipe: true,
		'pipe.completion': true,
		'pipe.request': false,
		'pipe.response': false,
		tool: false,
		memory: false,
	},
	memory: {
		useLocalEmbeddings: false,
	},
	envFilePath: '.env',
};
