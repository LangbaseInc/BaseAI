import type {
	ChatCompletionResponse,
	ErrorResponse,
	ProviderConfig,
	ModelParams,
	ProviderMessage
} from 'types/providers';

import { generateErrorResponse } from '../utils';
import { COHERE } from '@/dev/data/models';

export const CohereChatCompleteConfig: ProviderConfig = {
	model: {
		param: 'model',
		default: 'command-r',
		required: true
	},
	messages: [
		{
			param: 'message',
			required: true,
			// Adds the last message's content to the message param
			transform: (params: ModelParams) => {
				let message: string = '';

				if (!!params.messages) {
					let messages: ProviderMessage[] = params.messages;
					let lastMessage = messages[messages.length - 1];

					// Check if last message's content is a string
					if (typeof lastMessage.content === 'string') {
						message = lastMessage.content;
					}
					// TODO: Handle if content is an object
				}
				return message;
			}
		},
		{
			param: 'chat_history',
			// Adds all messages except the last one to the chat_history param which is an array of objects with role and message
			transform: (params: ModelParams) => {
				let chat_history: { role: string; message: string }[] = [];

				if (!!params.messages) {
					let messages: ProviderMessage[] = params.messages;

					// Retrun if there is only one message. No need to add it to chat_history
					if (messages.length === 1) return chat_history;
					// Remove the last message. It will be sent as the message param
					messages.pop();

					messages.forEach(msg => {
						if (typeof msg.content === 'string') {
							// Map roles to the ones accepted by Cohere. Default is USER.
							let role: 'CHATBOT' | 'SYSTEM' | 'USER' = 'USER';
							if (msg.role === 'assistant') {
								role = 'CHATBOT';
							} else if (msg.role === 'system') {
								role = 'SYSTEM';
							}
							chat_history.push({ role, message: msg.content });
						}
					});
				}
				return chat_history;
			}
		}
	],
	max_tokens: {
		param: 'max_tokens',
		default: 50,
		min: 1
	},
	temperature: {
		param: 'temperature',
		default: 0.3,
		min: 0,
		max: 5
	},
	top_p: {
		param: 'p',
		default: 0.75,
		min: 0,
		max: 1
	},
	top_k: {
		param: 'k',
		default: 0,
		max: 500
	},
	frequency_penalty: {
		param: 'frequency_penalty',
		default: 0,
		min: 0,
		max: 1
	},
	// TODO: @ahmadbilaldev Error: cannot specify both frequency_penalty and presence_penalty. However, docs say this is supported.
	// presence_penalty: {
	// 	param: "presence_penalty",
	// 	default: 0,
	// 	min: 0,
	// 	max: 1,
	// },
	stop: {
		param: 'stop_sequences'
	},
	stream: {
		param: 'stream',
		default: false
	},
	prompt_truncation: {
		param: 'prompt_truncation',
		default: 'OFF',
		required: true
	}
};

interface CohereCompleteResponse {
	response_id: string;
	text: string;
	chat_history: {
		role: string;
		message: string;
	}[];
	finish_reason: string;
	meta: {
		api_version: {
			version: string;
		};
		tokens: {
			input_tokens: number;
			output_tokens: number;
		};
	};
	message?: string;
	status?: number;
}

export const CohereChatCompleteResponseTransform: (
	response: CohereCompleteResponse,
	responseStatus: number
) => ChatCompletionResponse | ErrorResponse = (response, responseStatus) => {
	if (responseStatus !== 200) {
		return generateErrorResponse(
			{
				message: response.message || '',
				type: null,
				param: null,
				code: null
			},
			COHERE
		);
	}
	const { input_tokens = 0, output_tokens = 0 } = response.meta?.tokens;

	return {
		id: response.response_id,
		object: 'chat_completion',
		created: Math.floor(Date.now() / 1000),
		model: 'Unknown',
		provider: COHERE,
		choices: [
			{
				message: { role: 'assistant', content: response.text },
				index: 0,
				finish_reason: response.finish_reason
			}
		],
		usage: {
			prompt_tokens: input_tokens,
			completion_tokens: output_tokens,
			total_tokens: input_tokens + output_tokens
		}
	};
};

export interface CohereStreamChunk {
	id?: string;
	response: {
		generations?: {
			id: string;
			text: string;
			finish_reason: boolean;
		}[];
	};
	prompt?: string;
	meta?: {
		api_version: {
			version: string;
		};
	};
	text: string;
	is_finished: boolean;
	index?: number;
}

export const CohereChatCompleteStreamChunkTransform: (
	response: string,
	fallbackId: string
) => string = (responseChunk, fallbackId) => {
	let chunk = responseChunk.trim();
	chunk = chunk.replace(/^data: /, '');
	chunk = chunk.trim();
	const parsedChunk: CohereStreamChunk = JSON.parse(chunk);

	// discard the last cohere chunk as it sends the whole response combined.
	if (parsedChunk.is_finished) {
		return '';
	}
	return (
		`data: ${JSON.stringify({
			id: parsedChunk.id ?? fallbackId,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: '',
			provider: COHERE,
			choices: [
				{
					delta: {
						content:
							parsedChunk.response?.generations?.[0]?.text ??
							parsedChunk.text
					},
					index: parsedChunk.index ?? 0,
					logprobs: null,
					finish_reason:
						parsedChunk.response?.generations?.[0]?.finish_reason ??
						null
				}
			]
		})}` + '\n\n'
	);
};
