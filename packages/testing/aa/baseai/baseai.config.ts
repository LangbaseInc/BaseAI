import type {BaseAIConfig} from '../../core/types/config';

export const config: BaseAIConfig = {
	log: {
		isEnabled: true,
		logSensitiveData: false,
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		tool: true,
		memory: true,
	},
};