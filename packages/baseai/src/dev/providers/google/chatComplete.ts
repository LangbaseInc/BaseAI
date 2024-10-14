import {
	generateErrorResponse,
	generateInvalidProviderResponseError,
	getMimeType
} from '../utils';
import { GOOGLE } from '@/dev/data/models';
import type { ToolCall, ToolChoice } from 'types/pipe';
import type {
	ChatCompletionResponse,
	ContentType,
	ErrorResponse,
	MessageRole,
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

export type GoogleMessageRole = 'user' | 'model' | 'function';

interface GoogleFunctionCallMessagePart {
	functionCall: GoogleGenerateFunctionCall;
}

interface GoogleFunctionResponseMessagePart {
	functionResponse: {
		name: string;
		response: {
			name?: string;
			content: string;
		};
	};
}

type GoogleMessagePart =
	| GoogleFunctionCallMessagePart
	| GoogleFunctionResponseMessagePart
	| { text: string };

export interface GoogleMessage {
	role: GoogleMessageRole;
	parts: GoogleMessagePart[];
}

export interface GoogleToolConfig {
	function_calling_config: {
		mode: GoogleToolChoiceType | undefined;
		allowed_function_names?: string[];
	};
}

export const transformOpenAIRoleToGoogleRole = (
	role: MessageRole
): GoogleMessageRole => {
	switch (role) {
		case 'assistant':
			return 'model';
		case 'tool':
			return 'function';
		// Not all gemini models support system role
		case 'system':
			return 'user';
		// user is the default role
		default:
			return role;
	}
};

type GoogleToolChoiceType = 'AUTO' | 'ANY' | 'NONE';

export const transformToolChoiceForGemini = (
	tool_choice: ToolChoice
): GoogleToolChoiceType | undefined => {
	if (typeof tool_choice === 'object' && tool_choice.type === 'function')
		return 'ANY';
	if (typeof tool_choice === 'string') {
		switch (tool_choice) {
			case 'auto':
				return 'AUTO';
			case 'none':
				return 'NONE';
			case 'required':
				return 'ANY';
		}
	}
	return undefined;
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
			const messages: GoogleMessage[] = [];
			let lastRole: GoogleMessageRole | undefined;

			params.messages?.forEach((message: ProviderMessage) => {
				const role = transformOpenAIRoleToGoogleRole(message.role);
				let parts = [];

				if (message.role === 'assistant' && message.tool_calls) {
					message.tool_calls.forEach((tool_call: ToolCall) => {
						parts.push({
							functionCall: {
								name: tool_call.function.name,
								args: JSON.parse(tool_call.function.arguments)
							}
						});
					});
				} else if (
					message.role === 'tool' &&
					typeof message.content === 'string'
				) {
					parts.push({
						functionResponse: {
							name: message.name ?? 'lb-random-tool-name',
							response: {
								content: message.content
							}
						}
					});
				} else if (
					message.content &&
					typeof message.content === 'object'
				) {
					message.content.forEach((c: ContentType) => {
						if (c.type === 'text') {
							parts.push({
								text: c.text
							});
						}
						if (c.type === 'image_url') {
							const { url } = c.image_url || {};
							if (!url) return;

							// Handle different types of image URLs
							if (url.startsWith('data:')) {
								const [mimeTypeWithPrefix, base64Image] =
									url.split(';base64,');
								const mimeType =
									mimeTypeWithPrefix.split(':')[1];

								parts.push({
									inlineData: {
										mimeType: mimeType,
										data: base64Image
									}
								});
							} else if (
								url.startsWith('gs://') ||
								url.startsWith('https://') ||
								url.startsWith('http://')
							) {
								parts.push({
									fileData: {
										mimeType: getMimeType(url),
										fileUri: url
									}
								});
							} else {
								parts.push({
									inlineData: {
										mimeType: 'image/jpeg',
										data: c.image_url?.url
									}
								});
							}
						}
					});
				} else if (typeof message.content === 'string') {
					parts.push({
						text: message.content
					});
				}

				// Combine consecutive messages if they are from the same role
				// This takes care of the "Please ensure that multiturn requests alternate between user and model.
				// Also possible fix for "Please ensure that function call turn comes immediately after a user turn or after a function response turn." in parallel tool calls
				const shouldCombineMessages =
					lastRole === role && !params.model?.includes('vision');

				if (shouldCombineMessages) {
					messages[messages.length - 1].parts.push(...parts);
				} else {
					messages.push({ role, parts });
				}
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
	},
	tool_choice: {
		param: 'tool_config',
		default: '',
		transform: (params: ModelParams) => {
			if (params.tool_choice) {
				const allowedFunctionNames: string[] = [];
				// If tool_choice is an object and type is function, add the function name to allowedFunctionNames
				if (
					typeof params.tool_choice === 'object' &&
					params.tool_choice.type === 'function'
				) {
					allowedFunctionNames.push(params.tool_choice.function.name);
				}
				const toolConfig: GoogleToolConfig = {
					function_calling_config: {
						mode: transformToolChoiceForGemini(params.tool_choice)
					}
				};
				// TODO: @msaaddev I think we can't have more than one function in tool_choice
				// but this will also handle the case if we have more than one function in tool_choice

				// If tool_choice has functions, add the function names to allowedFunctionNames
				if (allowedFunctionNames.length > 0) {
					toolConfig.function_calling_config.allowed_function_names =
						allowedFunctionNames;
				}
				return toolConfig;
			}
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
	usageMetadata: {
		promptTokenCount: number;
		candidatesTokenCount: number;
		totalTokenCount: number;
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
				response.candidates?.map(generation => {
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
							content: null,
							tool_calls: generation.content.parts.map(part => {
								if (part.functionCall) {
									return {
										id: crypto.randomUUID(),
										type: 'function',
										function: {
											name: part.functionCall.name,
											arguments: JSON.stringify(
												part.functionCall.args
											)
										}
									};
								}
							})
						};
					}
					return {
						message: message,
						index: generation.index,
						finish_reason: generation.finishReason
					};
				}) ?? [],
			usage: {
				prompt_tokens: response.usageMetadata.promptTokenCount,
				completion_tokens: response.usageMetadata.candidatesTokenCount,
				total_tokens: response.usageMetadata.totalTokenCount
			}
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
				parsedChunk.candidates?.map(generation => {
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
							tool_calls: generation.content.parts.map(
								(part, idx) => {
									if (part.functionCall) {
										return {
											index: idx,
											id: crypto.randomUUID(),
											type: 'function',
											function: {
												name: part.functionCall.name,
												arguments: JSON.stringify(
													part.functionCall.args
												)
											}
										};
									}
								}
							)
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
