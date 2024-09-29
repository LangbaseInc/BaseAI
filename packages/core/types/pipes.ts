import {
	AnthropicModels,
	CohereModels,
	FireworksAIModels,
	GoogleModels,
	GroqModels,
	MistralAIModels,
	OllamaModels,
	OpenAIModels,
	PerplexityModels,
	TogetherModels,
} from './model';
export type MessageRole = 'function' | 'assistant' | 'system' | 'user' | 'tool';

export interface Message {
	role: MessageRole;
	content: string;
	name?: string;
}

interface ToolFunction {
	name: string;
}

interface ToolChoiceFunction {
	type: 'function';
	function: ToolFunction;
}

type ToolChoice = 'auto' | 'required' | ToolChoiceFunction;

export type Model =
	| OpenAIModels
	| TogetherModels
	| AnthropicModels
	| GroqModels
	| GoogleModels
	| CohereModels
	| FireworksAIModels
	| PerplexityModels
	| MistralAIModels
	| OllamaModels;

export interface Pipe {
	apiKey?: string;
	name: string;
	description?: string;
	status: 'public' | 'private';
	model: Model;
	stream?: boolean;
	json?: boolean;
	store?: boolean;
	moderate?: boolean;
	top_p: number;
	max_tokens: number;
	temperature: number;
	presence_penalty: number;
	frequency_penalty: number;
	stop: string[];
	tool_choice: ToolChoice;
	parallel_tool_calls: boolean;
	messages: Message[];
	variables: any[];
	tools: any[];
	memory: {name: string}[];
}

export interface PipeOld {
	name: string;
	description: string;
	status: string;
	config: {
		meta: {
			stream: boolean;
			json: boolean;
			store: boolean;
			moderate: boolean;
		};
		model: {
			name: string;
			provider: string;
			params: {
				top_p: number;
				max_tokens: number;
				temperature: number;
				presence_penalty: number;
				frequency_penalty: number;
				stop: string[];
			};
			tool_choice: string;
			parallel_tool_calls: boolean;
		};
		prompt: {
			system: string;
			opening: string;
			safety: string;
			messages: {role: string; content: string}[];
			variables: any[];
			json: string;
			rag: string;
		};
		functions: any[];
		memorysets: string[];
	};
}
