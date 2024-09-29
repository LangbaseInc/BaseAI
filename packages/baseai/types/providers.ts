/**
 * Message type supporting providers, multi-model, function and tool calls.
 */
export interface ProviderMessage {
	/** The role of the message sender. It can be 'system', 'user', 'assistant', or 'function'. */
	role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
	/** The content of the message. */
	content?: string | ContentType[];
	/** The name of the function to call, if any. */
	name?: string;
	/** The function call to make, if any. */
	function_call?: any;
	tool_calls?: any;
	citationMetadata?: CitationMetadata;
}

/**
 * Message content type.
 */
export interface ContentType {
	type: string;
	text?: string;
	image_url?: {
		url: string;
	};
}

/**
 * Global type for parameters sent to the providers.
 */
export interface ModelParams {
	model?: string;
	prompt?: string | string[];
	messages?: ProviderMessage[];
	functions?: LlmFunction[];
	function_call?: 'none' | 'auto' | { name: string };
	max_tokens?: number;
	temperature?: number;
	top_p?: number;
	n?: number;
	stream?: boolean;
	logprobs?: number;
	echo?: boolean;
	stop?: string | string[];
	presence_penalty?: number;
	frequency_penalty?: number;
	best_of?: number;
	logit_bias?: { [key: string]: number };
	user?: string;
	context?: string;
	examples?: Examples[];
	top_k?: number;
	tools?: Tool[];
	response_format?: { type: string };
	tool_calls?: any;
	tool_choice?: any;
	parallel_tool_calls?: any;
}

/**
 * Configuration for a parameter.
 */
export interface ParameterConfig {
	/** The name of the parameter. */
	param: string;
	/** The default value of the parameter, if not provided in the request. */
	default?: any;
	/** The minimum value of the parameter. */
	min?: number;
	/** The maximum value of the parameter. */
	max?: number;
	/** Whether the parameter is required. */
	required?: boolean;
	/** A function to transform the value of the parameter. */
	transform?: Function;
}

/**
 * Configuration for an AI provider.
 */
export interface ProviderConfig {
	/** The configuration for each parameter, indexed by parameter name. */
	[key: string]: ParameterConfig | ParameterConfig[];
}

/**
 * Configuration for an AI provider's API.
 */
export interface ProviderAPIConfig {
	/** The base URL of the API. */
	baseURL?: string;
	/** The endpoint for the 'complete' function. */
	complete?: string;
	/** The endpoint for the 'stream-complete' function. */
	'stream-complete'?: string;
	/** The endpoint for the 'chatComplete' function. */
	chatComplete?: string;
	/** The endpoint for the 'stream-chatComplete' function. */
	'stream-chatComplete'?: string;
	/** The endpoint for the 'embed' function. */
	embed?: string;
	/** The endpoint for the 'rerank' function. */
	rerank?: string;
	/** The endpoint for the 'moderate' function. */
	moderate?: string;
	/** A function to generate the headers for the API request. */
	headers: Function;
	/** A function to generate the baseURL based on parameters */
	getBaseURL?: Function;
	/** A function to generate the endpoint based on parameters */
	getEndpoint?: Function;
	/** The endpoint for the 'stream-chatComplete' function. */
	proxy?: string;
	/** The endpoint for 'imageGenerate' function */
	imageGenerate?: string;
}

export type endpointStrings =
	| 'complete'
	| 'chatComplete'
	| 'embed'
	| 'rerank'
	| 'moderate'
	| 'stream-complete'
	| 'stream-chatComplete'
	| 'proxy'
	| 'imageGenerate';

/**
 * A collection of API configurations for multiple AI providers.
 */
export interface ProviderAPIConfigs {
	/** The API configuration for each provider, indexed by provider name. */
	[key: string]: ProviderAPIConfig;
}

/**
 * A collection of configurations for multiple AI providers.
 */
export interface ProviderConfigs {
	/** The configuration for each provider, indexed by provider name. */
	[key: string]: any;
}

/**
 * Configurations for provider. Can be used to include keys, custom urls and headers.
 * @interface
 */
export interface ProviderOptions {
	/** The name of the provider. */
	provider: string | undefined;
	/** The LLM API key for the provider. */
	llmApiKey?: string;
	// Custom host url, used by some providers like Ollama
	customHost?: string;
}

/**
 * An example param in the conversation.
 */

interface Examples {
	input?: ProviderMessage;
	output?: ProviderMessage;
}

/**
 * A tool in the conversation.
 */
export interface Tool {
	/** The name of the function. */
	type: string;
	/** A description of the function. */
	function?: LlmFunction;
}

/**
 * A function in the conversation.
 */
export interface LlmFunction {
	/** The name of the function. */
	name: string;
	/** A description of the function. */
	description?: string;
	/** The parameters for the function. */
	parameters?: JsonSchema;
}

/**
 * A JSON schema.
 */
export interface JsonSchema {
	/** The schema definition, indexed by key. */
	[key: string]: any;
}

/**
 * Citation in message
 */
export interface CitationMetadata {
	citationSources?: CitationSource[];
}

export interface CitationSource {
	startIndex?: number;
	endIndex?: number;
	uri?: string;
	license?: string;
}

export interface BaseResponse {
	object: string;
	model: string;
}

/**
 * The basic structure of a completion response.
 * @interface
 */
export interface CResponse extends BaseResponse {
	id: string;
	created: number;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

/**
 * The structure of a completion response for the 'complete' function.
 * @interface
 */
export interface CompletionResponse extends CResponse {
	choices: {
		text: string;
		index: number;
		logprobs: null;
		finish_reason: string;
	}[];
}

/**
 * The structure of a choice in a chat completion response.
 * @interface
 */
export interface ChatChoice {
	index: number;
	message: ProviderMessage;
	finish_reason: string;
	logprobs?: object | null;
}

/**
 * The structure of a completion response for the 'chatComplete' function.
 * @interface
 */
export interface ChatCompletionResponse extends CResponse {
	choices: ChatChoice[];
}

/**
 * The structure of a error response for all functions
 * @interface
 */
export interface ErrorResponse {
	error: {
		message: string;
		type: string | null;
		param: string | null;
		code: string | null;
	};
	provider: string;
}

/**
 * The structure of a image generation response
 * @interface
 */
export interface ImageGenerateResponse {
	created: string;
	data: object[];
	provider: string;
}
