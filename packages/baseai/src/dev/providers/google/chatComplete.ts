import {
	generateErrorResponse,
	generateInvalidProviderResponseError
} from '../utils';
import { GOOGLE } from '@/dev/data/models';
import type {
	ChatCompletionResponse,
	ContentType,
	ErrorResponse,
	ModelParams,
	ProviderConfig,
	ProviderMessage
} from 'types/providers';

const transformGenerationConfig = (params: ModelParams) => {
	const generationConfig: Record<string, any> = {};
	if (params['temperature']) {
		generationConfig['temperature'] = params['temperature'];
	}
	if (params['top_p']) {
		generationConfig['topP'] = params['top_p'];
	}
	if (params['top_k']) {
		generationConfig['topK'] = params['top_k'];
	}
	if (params['max_tokens']) {
		generationConfig['maxOutputTokens'] = params['max_tokens'];
	}
	if (params['stop']) {
		generationConfig['stopSequences'] = params['stop'];
	}
	return generationConfig;
};

export const GoogleChatCompleteConfig: ProviderConfig = {
	model: {
		param: 'model',
		required: true,
		default: 'gemini-pro'
	},
	messages: {
		param: 'contents',
		default: '',
		transform: (params: ModelParams) => {
			let lastRole: 'user' | 'model' | undefined;
			const messages: { role: string; parts: { text: string }[] }[] = [];

			params.messages?.forEach((message: ProviderMessage) => {
				const role = message.role === 'assistant' ? 'model' : 'user';
				let parts = [];
				if (typeof message.content === 'string') {
					parts.push({
						text: message.content
					});
				}

				if (message.content && typeof message.content === 'object') {
					message.content.forEach((c: ContentType) => {
						if (c.type === 'text') {
							parts.push({
								text: c.text
							});
						}
						if (c.type === 'image_url') {
							parts.push({
								inlineData: {
									mimeType: 'image/jpeg',
									data: c.image_url?.url
								}
							});
						}
					});
				}

				// @NOTE: This takes care of the "Please ensure that multiturn requests alternate between user and model."
				// error that occurs when we have multiple user messages in a row.
				const shouldAppendEmptyModeChat =
					lastRole === 'user' &&
					role === 'user' &&
					!params.model?.includes('vision');

				if (shouldAppendEmptyModeChat) {
					messages.push({ role: 'model', parts: [{ text: '' }] });
				}

				messages.push({ role, parts });
				lastRole = role;
			});
			return messages;
		}
	},
	temperature: {
		param: 'generationConfig',
		transform: (params: ModelParams) => transformGenerationConfig(params)
	},
	top_p: {
		param: 'generationConfig',
		transform: (params: ModelParams) => transformGenerationConfig(params)
	},
	top_k: {
		param: 'generationConfig',
		transform: (params: ModelParams) => transformGenerationConfig(params)
	},
	max_tokens: {
		param: 'generationConfig',
		transform: (params: ModelParams) => transformGenerationConfig(params)
	},
	stop: {
		param: 'generationConfig',
		transform: (params: ModelParams) => transformGenerationConfig(params)
	},
	tools: {
		param: 'tools',
		default: '',
		transform: (params: ModelParams) => {
			const functionDeclarations: any = [];
			params.tools?.forEach(tool => {
				if (tool.type === 'function') {
					functionDeclarations.push(tool.function);
				}
			});
			return [{ functionDeclarations }];
		}
	}
};

export interface GoogleErrorResponse {
	error: {
		code: number;
		message: string;
		status: string;
		details: Array<Record<string, any>>;
	};
}

interface GoogleGenerateFunctionCall {
	name: string;
	args: Record<string, any>;
}

interface GoogleGenerateContentResponse {
	candidates: {
		content: {
			parts: {
				text?: string;
				functionCall?: GoogleGenerateFunctionCall;
			}[];
		};
		finishReason: string;
		index: number;
		safetyRatings: {
			category: string;
			probability: string;
		}[];
	}[];
	promptFeedback: {
		safetyRatings: {
			category: string;
			probability: string;
		}[];
	};
}

export const GoogleChatCompleteResponseTransform: (
	response: GoogleGenerateContentResponse | GoogleErrorResponse,
	responseStatus: number
) => ChatCompletionResponse | ErrorResponse = (response, responseStatus) => {
	// Extract error from response. It is in an array when streaming, and object when not streaming
	const errorObject = Array.isArray(response)
		? response.find(item => 'error' in item)?.error
		: 'error' in response
			? response.error
			: null;

	if (responseStatus !== 200 && errorObject) {
		return generateErrorResponse(
			{
				message: errorObject?.message ?? '',
				type: errorObject?.status ?? null,
				param: null,
				code: errorObject?.code ? `${errorObject.code}` : null
			},
			GOOGLE
		);
	}

	if ('candidates' in response) {
		return {
			id: crypto.randomUUID(),
			object: 'chat_completion',
			created: Math.floor(Date.now() / 1000),
			model: 'Unknown',
			provider: GOOGLE,
			choices:
				response.candidates?.map((generation, index) => {
					// In blocking mode: Google AI does not return content if response > max output tokens param
					// Test it by asking a big response while keeping maxtokens low ~ 50
					if (
						generation.finishReason === 'MAX_TOKENS' &&
						!generation.content
					) {
						throw Error(
							'The response exceeded your Max Tokens limit parameter. Increase the limit or change the prompt accordingly.'
						);
					}

					let message: ProviderMessage = {
						role: 'assistant',
						content: ''
					};
					if (generation.content?.parts[0]?.text) {
						message = {
							role: 'assistant',
							content: generation.content.parts[0]?.text
						};
					} else if (generation.content?.parts[0]?.functionCall) {
						message = {
							role: 'assistant',
							tool_calls: [
								{
									id: crypto.randomUUID(),
									type: 'function',
									function: {
										name: generation.content.parts[0]
											?.functionCall.name,
										arguments: JSON.stringify(
											generation.content.parts[0]
												?.functionCall.args
										)
									}
								}
							]
						};
					}
					return {
						message: message,
						index: generation.index,
						finish_reason: generation.finishReason
					};
				}) ?? []
		};
	}

	return generateInvalidProviderResponseError(response, GOOGLE);
};

export const GoogleChatCompleteStreamChunkTransform: (
	response: string,
	fallbackId: string
) => string = (responseChunk, fallbackId) => {
	let chunk = responseChunk.trim();
	if (chunk.startsWith('[')) {
		chunk = chunk.slice(1);
	}

	if (chunk.endsWith(',')) {
		chunk = chunk.slice(0, chunk.length - 1);
	}
	if (chunk.endsWith(']')) {
		chunk = chunk.slice(0, chunk.length - 2);
	}
	chunk = chunk.replace(/^data: /, '');
	chunk = chunk.trim();
	if (chunk === '[DONE]') {
		return `data: ${chunk}\n\n`;
	}

	const parsedChunk: GoogleGenerateContentResponse = JSON.parse(chunk);

	return (
		`data: ${JSON.stringify({
			id: fallbackId,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: '',
			provider: 'google',
			choices:
				parsedChunk.candidates?.map((generation, index) => {
					let message: ProviderMessage = {
						role: 'assistant',
						content: ''
					};
					if (generation.content.parts[0]?.text) {
						message = {
							role: 'assistant',
							content: generation.content.parts[0]?.text
						};
					} else if (generation.content.parts[0]?.functionCall) {
						message = {
							role: 'assistant',
							tool_calls: [
								{
									id: crypto.randomUUID(),
									type: 'function',
									index: 0,
									function: {
										name: generation.content.parts[0]
											?.functionCall.name,
										arguments: JSON.stringify(
											generation.content.parts[0]
												?.functionCall.args
										)
									}
								}
							]
						};
					}
					return {
						delta: message,
						index: generation.index,
						finish_reason: generation.finishReason
					};
				}) ?? []
		})}` + '\n\n'
	);
};
