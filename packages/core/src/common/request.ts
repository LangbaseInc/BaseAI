import {Stream} from 'openai/streaming';
import {Logger} from 'src/helpers/logger';
import {APIConnectionError, APIError} from './errors';

interface RequestOptions {
	endpoint: string;
	method: string;
	headers?: Record<string, string>;
	body?: any;
	stream?: boolean;
	rawResponse?: boolean;
}

interface RequestProps {
	apiKey?: string;
	baseUrl: string;
	timeout?: number;
	config?: any; // TODO: BaseAIConfig
}

interface SendOptions extends RequestOptions {
	endpoint: string;
}

interface MakeRequestParams {
	url: string;
	options: RequestOptions;
	headers: Record<string, string>;
}

interface HandleGenerateResponseParams {
	response: Response;
	isChat: boolean;
	threadId: string | null;
	rawResponse: boolean;
}

export class Request {
	private console: any;
	private props: RequestProps;

	constructor(props: RequestProps) {
		this.props = props;
		this.console = new Logger(this.props.config);
	}

	private async send<T>({endpoint, ...options}: SendOptions): Promise<T> {
		const url = this.buildUrl({endpoint});
		const headers = this.buildHeaders({headers: options.headers});

		let response: Response;
		try {
			response = await this.makeRequest({
				url,
				options: {...options, endpoint},
				headers,
			});
		} catch (error) {
			throw new APIConnectionError({
				cause: error instanceof Error ? error : undefined,
			});
		}

		if (!response.ok) {
			await this.handleErrorResponse({response});
		}

		const threadId = response.headers.get('lb-thread-id');

		if (options.body?.stream) {
			return this.handleRunResponseStream({
				response,
				rawResponse: options.body.rawResponse,
			}) as T;
		}

		return this.handleRunResponse({
			response,
			isChat: options.body?.chat,
			threadId,
			rawResponse: options.body?.rawResponse ?? false,
		});
	}

	private buildUrl({endpoint}: {endpoint: string}): string {
		return `${this.props.baseUrl}${endpoint}`;
	}

	private buildHeaders({
		headers,
	}: {
		headers?: Record<string, string>;
	}): Record<string, string> {
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.props.apiKey}`,
			...headers,
		};
	}

	private async makeRequest({
		url,
		options,
		headers,
	}: MakeRequestParams): Promise<Response> {
		this.console.log('pipe.request', {
			url,
			method: options.method,
			headers,
			body: options.body,
		});
		const resp = await fetch(url, {
			method: options.method,
			headers,
			body: JSON.stringify(options.body),
			signal: AbortSignal.timeout(this.props.timeout || 30000),
		});
		return resp;
	}

	private async handleErrorResponse({
		response,
	}: {
		response: Response;
	}): Promise<never> {
		let errorBody;
		try {
			errorBody = await response.json();
		} catch {
			errorBody = await response.text();
		}
		throw APIError.generate(
			response.status,
			errorBody,
			response.statusText,
			Object.fromEntries(response.headers.entries()),
		);
	}

	private handleRunResponseStream({
		response,
		rawResponse,
	}: {
		response: Response;
		rawResponse?: boolean;
	}): {
		stream: any;
		threadId: string | null;
		rawResponse?: {
			headers: Record<string, string>;
		};
	} {
		const controller = new AbortController();
		// const stream = Stream.fromSSEResponse(response, controller);
		const streamSSE = Stream.fromSSEResponse(response, controller);
		const stream = streamSSE.toReadableStream();

		const result: {
			stream: ReadableStream<any>;
			threadId: string | null;
			rawResponse?: {
				headers: Record<string, string>;
			};
		} = {
			stream,
			threadId: response.headers.get('lb-thread-id'),
		};
		if (rawResponse) {
			result.rawResponse = {
				headers: Object.fromEntries(response.headers.entries()),
			};
		}
		return result;
	}

	private async handleRunResponse({
		response,
		isChat,
		threadId,
		rawResponse,
	}: HandleGenerateResponseParams): Promise<any> {
		const generateResponse = await response.json();
		const buildResponse = generateResponse.raw
			? {
					completion: generateResponse.completion,
					...generateResponse.raw,
				}
			: generateResponse;

		const result: any = {
			...buildResponse,
		};

		result.threadId = threadId;

		if (rawResponse) {
			result.rawResponse = {
				headers: Object.fromEntries(response.headers.entries()),
			};
		}

		return result;
	}

	async post<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
		return this.send<T>({...options, method: 'POST'});
	}

	async get<T>(options: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
		return this.send<T>({...options, method: 'GET'});
	}

	async put<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
		return this.send<T>({...options, method: 'PUT'});
	}

	async delete<T>(
		options: Omit<RequestOptions, 'method' | 'body'>,
	): Promise<T> {
		return this.send<T>({...options, method: 'DELETE'});
	}
}
