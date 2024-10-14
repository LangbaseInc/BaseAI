import type {
	ChatCompletionResponse,
	ContentType,
	ErrorResponse,
	MessageRole,
	ModelParams,
	ProviderConfig,
	ProviderMessage
} from 'types/providers';
import { ANTHROPIC } from '@/data/models';
import { generateInvalidProviderResponseError } from '../utils';

interface AnthropicTool {
	name: string;
	description: string;
	input_schema: {
		type: string;
		properties: Record<
			string,
			{
				type: string;
				description: string;
			}
		>;
		required: string[];
	};
}

interface AnthropicToolResultContentItem {
	type: 'tool_result';
	tool_use_id: string;
	content?: string;
}

type AnthropicMessageContentItem = AnthropicToolResultContentItem | ContentType;

interface AnthropicMessage extends ProviderMessage {
	content?: string | AnthropicMessageContentItem[];
}

interface AnthorpicTextContentItem {
	type: 'text';
	text: string;
}

interface AnthropicToolContentItem {
	type: 'tool_use';
	name: string;
	id: string;
	input: Record<string, any>;
}

type AnthropicContentItem = AnthorpicTextContentItem | AnthropicToolContentItem;

const transformAssistantMessage = (msg: ProviderMessage): AnthropicMessage => {
	let content: AnthropicContentItem[] = [];
	const containsToolCalls = msg.tool_calls && msg.tool_calls.length;

	if (msg.content && typeof msg.content === 'string') {
		content.push({
			type: 'text',
			text: msg.content
		});
	} else if (
		msg.content &&
		typeof msg.content === 'object' &&
		msg.content.length
	) {
		if (msg.content[0].text) {
			content.push({
				type: 'text',
				text: msg.content[0].text
			});
		}
	}
	if (containsToolCalls) {
		msg.tool_calls.forEach((toolCall: any) => {
			content.push({
				type: 'tool_use',
				name: toolCall.function.name,
				id: toolCall.id,
				input: JSON.parse(toolCall.function.arguments)
			});
		});
	}
	return {
		role: msg.role,
		content
	};
};

const transformToolMessage = (msg: ProviderMessage): AnthropicMessage => {
	return {
		role: 'user',
		content: [
			{
				type: 'tool_result',
				tool_use_id: msg.tool_call_id,
				content: msg.content as string
			}
		]
	};
};

export const AnthropicChatCompleteConfig: ProviderConfig = {
	model: {
		param: 'model',
		default: 'claude-3-haiku',
		required: true
	},
	messages: [
		{
			param: 'messages',
			required: true,
			transform: (params: ModelParams) => {
				let messages: ProviderMessage[] = [];
				let lastRole: MessageRole | undefined;

				if (!!params.messages) {
					params.messages.forEach((msg: ProviderMessage) => {
						if (msg.role === 'system') return;

						if (msg.role === 'assistant') {
							messages.push(transformAssistantMessage(msg));
						} else if (
							msg.content &&
							typeof msg.content === 'object' &&
							msg.content.length
						) {
							const transformedMessage: Record<string, any> = {
								role: msg.role,
								content: []
							};
							msg.content.forEach(item => {
								if (item.type === 'text') {
									transformedMessage.content.push({
										type: item.type,
										text: item.text
									});
								} else if (
									item.type === 'image_url' &&
									item.image_url &&
									item.image_url.url
								) {
									const parts = item.image_url.url.split(';');
									if (parts.length === 2) {
										const base64ImageParts =
											parts[1].split(',');
										const base64Image = base64ImageParts[1];
										const mediaTypeParts =
											parts[0].split(':');
										if (
											mediaTypeParts.length === 2 &&
											base64Image
										) {
											const mediaType = mediaTypeParts[1];
											transformedMessage.content.push({
												type: 'image',
												source: {
													type: 'base64',
													media_type: mediaType,
													data: base64Image
												}
											});
										}
									}
								}
							});
							messages.push(
								transformedMessage as ProviderMessage
							);
						} else if (msg.role === 'tool') {
							// Combine consecutive tool messages into a single message
							// add consecutive tool message as tool_result in content array
							if (lastRole === 'tool') {
								const toolMessage = transformToolMessage(msg);
								const content =
									toolMessage.content as AnthropicMessageContentItem[];
								(
									messages[messages.length - 1]
										.content as AnthropicMessageContentItem[]
								).push(content[0]);
							} else {
								messages.push(transformToolMessage(msg));
							}
						} else {
							messages.push({
								role: msg.role,
								content: msg.content
							});
						}
						lastRole = msg.role;
					});
				}

				return messages;
			}
		},
		{
			param: 'system',
			required: false,
			transform: (params: ModelParams) => {
				let systemMessage: string = '';
				// Transform the chat messages into a simple prompt
				if (!!params.messages) {
					params.messages.forEach(msg => {
						if (
							msg.role === 'system' &&
							msg.content &&
							typeof msg.content === 'object' &&
							msg.content[0].text
						) {
							systemMessage = msg.content[0].text;
						} else if (
							msg.role === 'system' &&
							typeof msg.content === 'string'
						) {
							systemMessage = msg.content;
						}
					});
				}
				return systemMessage;
			}
		}
	],
	tools: {
		param: 'tools',
		required: false,
		transform: (params: ModelParams) => {
			let tools: AnthropicTool[] = [];
			if (params.tools) {
				params.tools.forEach(tool => {
					if (tool.function) {
						tools.push({
							name: tool.function.name,
							description: tool.function?.description || '',
							input_schema: {
								type:
									tool.function.parameters?.type || 'object',
								properties:
									tool.function.parameters?.properties || {},
								required:
									tool.function.parameters?.required || []
							}
						});
					}
				});
			}
			return tools;
		}
	},
	// None is not supported by Anthropic, defaults to auto
	tool_choice: {
		param: 'tool_choice',
		required: false,
		transform: (params: ModelParams) => {
			let toolChoice = {};
			if (params.tool_choice) {
				if (typeof params.tool_choice === 'string') {
					if (params.tool_choice === 'required')
						toolChoice = { type: 'any' };
					else if (params.tool_choice === 'auto')
						toolChoice = { type: 'auto' };
				} else if (typeof params.tool_choice === 'object') {
					toolChoice = {
						type: 'tool',
						name: params.tool_choice.function.name
					};
				}
			}

			if (!params.parallel_tool_calls) {
				toolChoice = { ...toolChoice, disable_parallel_tool_use: true };
			}

			return toolChoice;
		}
	},
	max_tokens: {
		param: 'max_tokens',
		required: true
	},
	temperature: {
		param: 'temperature',
		default: 1,
		min: 0,
		max: 1
	},
	top_p: {
		param: 'top_p',
		default: -1,
		min: -1
	},
	top_k: {
		param: 'top_k',
		default: -1
	},
	stop: {
		param: 'stop_sequences'
	},
	stream: {
		param: 'stream',
		default: false
	},
	user: {
		param: 'metadata.user_id'
	}
};

export interface AnthropicErrorObject {
	type: string;
	message: string;
}

interface AnthropicErrorResponse {
	type: string;
	error: AnthropicErrorObject;
}

interface AnthropicChatCompleteResponse {
	id: string;
	type: string;
	role: string;
	content: AnthropicContentItem[];
	stop_reason: string;
	model: string;
	stop_sequence: null | string;
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
}

export interface AnthropicChatCompleteStreamResponse {
	type: string;
	index: number;
	delta: {
		type: string;
		text: string;
		partial_json?: string;
		stop_reason?: string;
	};
	content_block?: {
		type: string;
		id?: string;
		text?: string;
		name?: string;
		input?: {};
	};
	usage?: {
		output_tokens?: number;
		input_tokens?: number;
		cache_creation_input_tokens?: number;
		cache_read_input_tokens?: number;
	};
	message?: {
		usage?: {
			output_tokens?: number;
			input_tokens?: number;
			cache_creation_input_tokens?: number;
			cache_read_input_tokens?: number;
		};
	};
}

export const AnthropicChatCompleteResponseTransform: (
	response: AnthropicChatCompleteResponse | AnthropicErrorResponse,
	responseStatus: number
) => ChatCompletionResponse | ErrorResponse = (response, responseStatus) => {
	if (responseStatus !== 200 && 'error' in response) {
		return {
			error: {
				message: response.error?.message,
				type: response.error?.type,
				param: null,
				code: null
			},
			provider: ANTHROPIC
		} as ErrorResponse;
	}

	if ('content' in response) {
		const { input_tokens = 0, output_tokens = 0 } = response?.usage;

		let content = '';
		if (response.content.length && response.content[0].type === 'text') {
			content = response.content[0].text;
		}

		let toolCalls: any = [];
		response.content.forEach(item => {
			if (item.type === 'tool_use') {
				toolCalls.push({
					id: item.id,
					type: 'function',
					function: {
						name: item.name,
						arguments: JSON.stringify(item.input)
					}
				});
			}
		});

		return {
			id: response.id,
			object: 'chat_completion',
			created: Math.floor(Date.now() / 1000),
			model: response.model,
			provider: ANTHROPIC,
			choices: [
				{
					message: {
						role: 'assistant',
						content,
						tool_calls: toolCalls.length ? toolCalls : undefined
					},
					index: 0,
					logprobs: null,
					finish_reason: response.stop_reason
				}
			],
			usage: {
				prompt_tokens: input_tokens,
				completion_tokens: output_tokens,
				total_tokens: input_tokens + output_tokens
			}
		};
	}
	return generateInvalidProviderResponseError(response, ANTHROPIC);
};

export const AnthropicChatCompleteStreamChunkTransform: (
	response: string,
	fallbackId: string
) => string | undefined = (responseChunk, fallbackId) => {
	let chunk = responseChunk.trim();
	if (
		chunk.startsWith('event: ping') ||
		chunk.startsWith('event: content_block_stop')
	) {
		return;
	}

	if (chunk.startsWith('event: message_stop')) {
		return 'data: [DONE]\n\n';
	}

	chunk = chunk.replace(/^event: content_block_delta[\r\n]*/, '');
	chunk = chunk.replace(/^event: content_block_start[\r\n]*/, '');
	chunk = chunk.replace(/^event: message_delta[\r\n]*/, '');
	chunk = chunk.replace(/^event: message_start[\r\n]*/, '');
	chunk = chunk.replace(/^data: /, '');
	chunk = chunk.trim();

	const parsedChunk: AnthropicChatCompleteStreamResponse = JSON.parse(chunk);

	if (parsedChunk.type === 'message_start') {
		return (
			`data: ${JSON.stringify({
				id: fallbackId,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: '',
				provider: ANTHROPIC,
				choices: [
					{
						delta: {
							content: ''
						},
						index: 0,
						logprobs: null,
						finish_reason: null
					}
				]
			})}` + '\n\n'
		);
	}

	if (parsedChunk.type === 'message_delta') {
		return (
			`data: ${JSON.stringify({
				id: fallbackId,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: '',
				provider: ANTHROPIC,
				choices: [
					{
						index: 0,
						delta: {},
						finish_reason: parsedChunk.delta?.stop_reason
					}
				]
			})}` + '\n\n'
		);
	}

	const toolCalls = [];
	const isToolBlockStart: boolean =
		parsedChunk.type === 'content_block_start' &&
		!!parsedChunk.content_block?.id;
	const isToolBlockDelta: boolean =
		parsedChunk.type === 'content_block_delta' &&
		!!parsedChunk.delta.partial_json;
	const toolIndex: number = parsedChunk.index;

	if (isToolBlockStart && parsedChunk.content_block) {
		toolCalls.push({
			index: toolIndex,
			id: parsedChunk.content_block.id,
			type: 'function',
			function: {
				name: parsedChunk.content_block.name,
				arguments: ''
			}
		});
	} else if (isToolBlockDelta) {
		toolCalls.push({
			index: toolIndex,
			function: {
				arguments: parsedChunk.delta.partial_json
			}
		});
	}

	return (
		`data: ${JSON.stringify({
			id: fallbackId,
			object: 'chat.completion.chunk',
			created: Math.floor(Date.now() / 1000),
			model: '',
			provider: ANTHROPIC,
			choices: [
				{
					delta: {
						content: parsedChunk.delta?.text,
						tool_calls: toolCalls.length ? toolCalls : undefined
					},
					index: 0,
					logprobs: null,
					finish_reason: parsedChunk.delta?.stop_reason ?? null
				}
			]
		})}` + '\n\n'
	);
};
