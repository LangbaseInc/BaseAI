import type { ProviderConfig } from 'types/providers';
export const GroqChatCompleteConfig: ProviderConfig = {
	model: {
		param: 'model',
		required: true,
		default: 'mixtral-8x7b-32768'
	},
	messages: {
		param: 'messages',
		default: ''
	},
	max_tokens: {
		param: 'max_tokens',
		default: 100,
		min: 0
	},
	temperature: {
		param: 'temperature',
		default: 1,
		min: 0,
		max: 2
	},
	top_p: {
		param: 'top_p',
		default: 1,
		min: 0,
		max: 1
	},
	stream: {
		param: 'stream',
		default: false
	},
	stop: {
		param: 'stop'
	},
	n: {
		param: 'n',
		default: 1,
		max: 1,
		min: 1
	}
};
