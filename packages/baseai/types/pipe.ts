import { z } from 'zod';
import type {
	AnthropicModels,
	CohereModels,
	FireworksAIModels,
	GoogleModels,
	GroqModels,
	MistralAIModels,
	OllamaModels,
	OpenAIModels,
	PerplexityModels,
	TogetherModels
} from './model';
import type { PipeTool } from './tools';

export const schemaMessage = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'function', 'tool']),
		content: z.string().nullable(),
		tool_call_id: z.string().optional(),
		name: z.string().optional(),
		tool_calls: z
			.array(
				z.object({
					id: z.string(),
					type: z.string(),
					function: z.record(z.unknown())
				})
			)
			.optional()
	})
	.refine(
		({ content, role, tool_calls }) => {
			// If content is null, role isn't assistant and tool_calls is not present.
			// then the schema is invalid
			// because the message content is null and its not an assistant tool call
			const isSchemaInvalid =
				content === null && role !== 'assistant' && !tool_calls;

			if (isSchemaInvalid) return false;
			return true;
		},
		{
			message: 'Message content cannot be empty.'
		}
	);

export type Message = z.infer<typeof schemaMessage>;

export const VariableSchema = z.object({
	name: z.string(),
	value: z.string()
});

export const VariablesSchema = z.array(VariableSchema).default([]);

export type VariablesI = z.infer<typeof VariablesSchema>;
export type VariableI = z.infer<typeof VariableSchema>;

interface ToolFunction {
	name: string;
}

interface ToolChoiceFunction {
	type: 'function';
	function: ToolFunction;
}

export type ToolChoice = 'auto' | 'required' | ToolChoiceFunction;

export type PipeModelT =
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
	description: string;
	status: 'public' | 'private';
	model: PipeModelT;
	stream: boolean;
	json: boolean;
	store: boolean;
	moderate: boolean;
	top_p: number;
	max_tokens: number;
	temperature: number;
	presence_penalty: number;
	frequency_penalty: number;
	stop: string[];
	tool_choice: ToolChoice;
	parallel_tool_calls: boolean;
	messages: Message[];
	variables: VariablesI;
	tools: PipeTool[];
	memory: {
		name: string;
	}[];
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
			tool_choice: ToolChoice;
			parallel_tool_calls: boolean;
		};
		prompt: {
			system: string;
			opening: string;
			safety: string;
			messages: { role: string; content: string }[];
			variables: VariablesI;
			json: string;
			rag: string;
		};
		tools: any[];
		memorysets: string[];
	};
}
