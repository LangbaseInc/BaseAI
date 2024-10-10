import type {Runner} from 'src/helpers';
import {Logger} from 'src/helpers/logger';
import {isLocalServerRunning} from 'src/utils/local-server-running';
import {Pipe as PipeI} from '../../types/pipes';
import {Request} from '../common/request';
import {getLLMApiKey} from '../utils/get-llm-api-key';
import {getApiUrl, isProd} from '../utils/is-prod';
import {toOldPipeFormat} from '../utils/to-old-pipe-format';

// Type Definitions
export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface Function {
	name: string;
	arguments: string;
}

export interface ToolCall {
	id: string;
	type: 'function';
	function: Function;
}

export interface Message {
	role: Role;
	content: string | null;
	name?: string;
	tool_call_id?: string;
	tool_calls?: ToolCall[];
}

export interface Variable {
	name: string;
	value: string;
}

export interface RunOptions {
	messages?: Message[];
	variables?: Variable[];
	threadId?: string;
	rawResponse?: boolean;
	tools?: Record<string, any>;
}

export interface RunOptionsStream extends RunOptions {
	stream: true;
}

export interface Usage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
}

export interface RunResponse {
	completion: string;
	threadId?: string;
	id: string;
	object: string;
	created: number;
	model: string;
	choices: ChoiceGenerate[];
	usage: Usage;
	system_fingerprint: string | null;
	rawResponse?: {
		headers: Record<string, string>;
	};
}

export interface RunResponseStream {
	stream: ReadableStream<any>;
	threadId: string | null;
	rawResponse?: {
		headers: Record<string, string>;
	};
}

export interface PipeOptions extends PipeI {
	maxCalls?: number;
	config?: any;
}

interface ChoiceGenerate {
	index: number;
	message: Message;
	logprobs: boolean | null;
	finish_reason: string;
}

interface Tool {
	run: (...args: any[]) => Promise<any>;
	function: {
		name: string;
		description: string;
		parameters: any;
	};
}

export class Pipe {
	private console: any;
	private config: any;
	private configEnv: any;
	private request: Request;
	private pipe: any;
	private tools: Record<string, (...args: any[]) => Promise<any>>;
	private maxCalls: number;
	private hasTools: boolean;

	constructor(options: PipeOptions) {
		this.config = options?.config;
		this.console = new Logger(this.config);
		this.configEnv = options?.config?.env;
		this.request = new Request({
			baseUrl: getApiUrl(this.configEnv),
			apiKey: options.apiKey,
			config: this.config,
		});
		this.pipe = toOldPipeFormat(options);
		delete this.pipe.apiKey;
		this.tools = this.getToolsFromPipe(this.pipe);
		this.maxCalls = options.maxCalls || 100; // TODO: Find a sane default.
		this.hasTools = Object.keys(this.tools).length > 0;
	}

	private getToolsFromPipe(
		pipe: any,
	): Record<string, (...args: any[]) => Promise<any>> {
		const tools: Record<string, (...args: any[]) => Promise<any>> = {};
		if (pipe.tools && Array.isArray(pipe.tools)) {
			pipe.tools.forEach((tool: Tool) => {
				tools[tool.function.name] = tool.run;
			});
		}
		return tools;
	}

	private async runTools({
		runOptions,
		toolCalls,
	}: {
		runOptions: Record<string, any>;
		toolCalls: ToolCall[];
	}): Promise<Message[]> {
		const toolPromises = toolCalls.map(async (toolCall: ToolCall) => {
			const toolName = toolCall.function.name;
			const toolParameters = JSON.parse(toolCall.function.arguments);
			const toolFunction = this.tools[toolName];
			const runParameter = toolOptions[toolName];

			if (!toolFunction) {
				throw new Error(`Tool '${toolName}' not found`);
			}

			const toolResponse = await toolFunction(toolParameters);

			return {
				tool_call_id: toolCall.id,
				role: 'tool' as Role,
				name: toolName,
				content: JSON.stringify(toolResponse),
			};
		});

		return Promise.all(toolPromises);
	}

	private hasNoToolCalls(message: Message): boolean {
		return !message.tool_calls || message.tool_calls.length === 0;
	}

	private getMessagesToSend(
		messages: Message[],
		responseMessage: Message,
		toolResults: Message[],
	): Message[] {
		return isProd()
			? toolResults
			: [...messages, responseMessage, ...toolResults];
	}

	private isStreamRequested(options: RunOptions | RunOptionsStream): boolean {
		return 'stream' in options && options.stream === true;
	}

	private warnIfToolsWithStream(requestedStream: boolean): void {
		if (this.hasTools && requestedStream) {
			console.warn(
				'Warning: Streaming is not yet supported when tools are present in the pipe. Falling back to non-streaming mode.',
			);
		}
	}

	public async run(options: RunOptionsStream): Promise<RunResponseStream>;
	public async run(options: RunOptions): Promise<RunResponse>;
	public async run(
		options: RunOptions | RunOptionsStream,
	): Promise<RunResponse | RunResponseStream> {
		this.console.log('pipe', this.pipe.name, 'PIPE RUN');

		const endpoint = '/beta/pipes/run';
		this.console.log(
			'pipe.run.baseUrl.endpoint',
			getApiUrl(this.configEnv) + endpoint,
		);
		this.console.log('pipe.runOptions', options);

		const requestedStream = this.isStreamRequested(options);
		const stream = this.hasTools ? false : requestedStream;
		this.warnIfToolsWithStream(requestedStream);

		const body = {...options, stream};

		let response = await this.createRequest<
			RunResponse | RunResponseStream
		>(endpoint, body);
		if (Object.entries(response).length === 0) {
			return {} as RunResponse | RunResponseStream;
		}

		this.console.log('pipe.response', response);

		if (stream) {
			return response as RunResponseStream;
		}

		let messages = options.messages || [];
		let currentResponse = response as RunResponse;
		let callCount = 0;

		while (callCount < this.maxCalls) {
			const responseMessage = currentResponse.choices[0].message;

			if (this.hasNoToolCalls(responseMessage)) {
				this.console.log(
					'pipe.hasNoToolCalls',
					'No more tool calls. Returning final response.',
				);
				return currentResponse;
			}

			this.console.log(
				'pipe.run.response.toolCalls',
				responseMessage.tool_calls,
			);

			const toolResults = await this.runTools({
				runOptions: options.tools,
				toolCalls: responseMessage.tool_calls as ToolCall[],
			});
			this.console.log('pipe.run.toolResults', toolResults);

			messages = this.getMessagesToSend(
				messages,
				responseMessage,
				toolResults,
			);

			// Simulate a delay
			// await new Promise(resolve => setTimeout(resolve, 1000));

			currentResponse = await this.createRequest<RunResponse>(endpoint, {
				...body,
				messages,
				stream: false,
				threadId: currentResponse.threadId,
			});

			callCount++;

			// Explicitly check if the new response has no tool calls
			if (this.hasNoToolCalls(currentResponse.choices[0].message)) {
				console.log(
					'New response has no tool calls. Returning final response.',
				);
				return currentResponse;
			}
		}

		console.warn(
			`Reached maximum number of calls (${this.maxCalls}). Returning last response.`,
		);
		return currentResponse;
	}

	private async createRequest<T>(endpoint: string, body: any): Promise<T> {
		const isProdEnv = isProd(this.configEnv);

		// PROD.
		if (isProdEnv) {
			const prodOptions = {
				endpoint,
				body: {
					...body,
					name: this.pipe.name,
				},
			};
			this.console.log('pipe.request.prodOptions', prodOptions);
			return this.request.post<T>(prodOptions);
		}

		// LOCAL.
		const isServerRunning = await isLocalServerRunning();
		if (!isServerRunning) return {} as T;

		const localOptions = {
			endpoint,
			body: {
				...body,
				pipe: this.pipe,
				llmApiKey: getLLMApiKey({
					modelProvider: this.pipe.model.provider,
					configEnv: this.configEnv,
				}),
			},
		};
		this.console.log('pipe.request.localOptions', localOptions);
		return this.request.post<T>(localOptions);
	}
}

/**
 * Generates text using the provided options.
 *
 * @param options - The options for generating text.
 * @returns A promise that resolves to the generated text.
 */
export const generateText = async (
	options: RunOptions & {pipe: Pipe},
): Promise<RunResponse> => {
	return options.pipe.run(options);
};

/**
 * Streams text using the provided options.
 *
 * @param options - The options for streaming text.
 * @returns A promise that resolves to the response of the stream operation.
 */
export const streamText = async (
	options: RunOptions & {pipe: Pipe},
): Promise<RunResponseStream> => {
	return options.pipe.run({...options, stream: true});
};

interface ContentChunk {
	type: 'content';
	content: string;
}

interface ToolCallChunk {
	type: 'toolCall';
	toolCall: ToolCall;
}

interface ChoiceStream {
	index: number;
	delta: Delta;
	logprobs: boolean | null;
	finish_reason: string;
}

interface Delta {
	role?: Role;
	content?: string;
	tool_calls?: ToolCall[];
}

interface UnknownChunk {
	type: 'unknown';
	rawChunk: ChunkStream;
}

export interface ChunkStream {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: ChoiceStream[];
}

export interface Chunk {
	type: 'content' | 'toolCall' | 'unknown';
	content?: string;
	toolCall?: ToolCall;
	rawChunk?: ChunkStream;
}

/**
 * Processes a chunk and returns a Chunk object.
 *
 * ```ts
 * for await (const chunk of runner) {
 *		const processedChunk = processChunk({rawChunk: chunk});
 *		if (isContent(processedChunk)) {
 *			process.stdout.write(processedChunk.content);
 *		}
 *	}
 * ```
 *
 * @param rawChunk - The raw chunk to process.
 * @returns The processed Chunk object.
 */
export const processChunk = ({rawChunk}: {rawChunk: any}): Chunk => {
	if (rawChunk.choices[0]?.delta?.content) {
		return {type: 'content', content: rawChunk.choices[0].delta.content};
	}
	if (
		rawChunk.choices[0]?.delta?.tool_calls &&
		rawChunk.choices[0].delta.tool_calls.length > 0
	) {
		const toolCall = rawChunk.choices[0].delta.tool_calls[0];
		return {type: 'toolCall', toolCall};
	}
	return {type: 'unknown', rawChunk};
};

/**
 * Checks if the given chunk is a ContentChunk.
 *
 * @param chunk - The chunk to check.
 * @returns True if the chunk is a ContentChunk, false otherwise.
 */
export const isContent = (chunk: Chunk): chunk is ContentChunk =>
	chunk.type === 'content';

/**
 * Determines if the given chunk is a ToolCallChunk.
 *
 * @param chunk - The chunk to be evaluated.
 * @returns True if the chunk is of type 'toolCall', otherwise false.
 */
export const isToolCall = (chunk: Chunk): chunk is ToolCallChunk =>
	chunk.type === 'toolCall';

/**
 * Checks if the given chunk is of type 'unknown'.
 *
 * @param chunk - The chunk to be checked.
 * @returns True if the chunk is of type 'unknown', false otherwise.
 */
export const isUnknown = (chunk: Chunk): chunk is UnknownChunk =>
	chunk.type === 'unknown';

/**
 * Retrieves the text content from a given ChunkStream.
 *
 * @param chunk - The ChunkStream object.
 * @returns The text content from the ChunkStream.
 */
export const getTextContent = (chunk: any): string => {
	return chunk.choices[0]?.delta?.content || '';
};

/**
 * Retrieves the text delta from a given chunk.
 *
 * @param chunk - The chunk stream to extract the text delta from.
 * @returns The text delta content, or an empty string if it is not available.
 */
export const getTextDelta = (chunk: ChunkStream): string => {
	return chunk.choices[0]?.delta?.content || '';
};

/**
 * Writes the content of a TextStream to the standard output.
 *
 * @param stream - The TextStream to be printed.
 * @returns A Promise that resolves when the printing is complete.
 */
export const printStreamToStdout = async (runner: Runner): Promise<void> => {
	for await (const chunk of runner) {
		const textPart = chunk.choices[0]?.delta?.content || '';
		process.stdout.write(textPart);
	}
};
