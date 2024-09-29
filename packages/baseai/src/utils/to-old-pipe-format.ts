import { OLLAMA } from '@/dev/data/models';
import type { Pipe, PipeOld } from './../../types/pipe';
import {
	ANTHROPIC,
	COHERE,
	FIREWORKS_AI,
	GOOGLE,
	GROQ,
	OPEN_AI,
	PERPLEXITY,
	TOGETHER_AI
} from './../data/models';

type Provider =
	| typeof OPEN_AI
	| typeof ANTHROPIC
	| typeof TOGETHER_AI
	| typeof GOOGLE
	| typeof GROQ
	| typeof COHERE
	| typeof FIREWORKS_AI
	| typeof PERPLEXITY;

/**
 * Converts a new pipe format to an old pipe format.
 *
 * @param newFormat - The new pipe format to convert.
 * @returns The converted old pipe format.
 */
export function toOldPipeFormat(newFormat: Pipe): PipeOld {
	const [providerString, modelName] = newFormat.model.split(':');

	const systemMessage = newFormat.messages.find(
		m => m.role === 'system' && !m.name
	);
	const safetyMessage = newFormat.messages.find(
		m => m.role === 'system' && m.name === 'safety'
	);
	const ragMessage = newFormat.messages.find(
		m => m.role === 'system' && m.name === 'rag'
	);
	const jsonMessage = newFormat.messages.find(
		m => m.role === 'system' && m.name === 'json'
	);

	return {
		name: newFormat.name,
		description: newFormat.description,
		status: newFormat.status,
		config: {
			meta: {
				stream: newFormat.stream,
				json: newFormat.json,
				store: newFormat.store,
				moderate: newFormat.moderate
			},
			model: {
				name: modelName,
				provider: getProvider(providerString),
				params: {
					top_p: newFormat.top_p,
					max_tokens: newFormat.max_tokens,
					temperature: newFormat.temperature,
					presence_penalty: newFormat.presence_penalty,
					frequency_penalty: newFormat.frequency_penalty,
					stop: newFormat.stop
				},
				tool_choice: newFormat.tool_choice,
				parallel_tool_calls: newFormat.parallel_tool_calls
			},
			prompt: {
				system:
					systemMessage?.content || 'You are a helpful AI assistant.',
				opening: 'Welcome to Langbase. Prompt away!',
				safety: safetyMessage?.content || '',
				messages: newFormat.messages
					.filter(m => m.role !== 'system')
					.map(m => ({ role: m.role, content: m.content ?? '' })),
				variables: newFormat.variables,
				json: jsonMessage?.content || '',
				rag: ragMessage?.content || ''
			},
			tools: newFormat.tools,
			memorysets: newFormat.memory.map(memory => memory.name)
		}
	};
}
/**
 * Retrieves the provider based on the given provider string.
 *
 * @param providerString - The provider string.
 * @returns The corresponding provider object.
 * @throws Error if the provider is unknown.
 */
function getProvider(providerString: string): Provider {
	const providerMap: { [key: string]: Provider } = {
		openai: OPEN_AI,
		anthropic: ANTHROPIC,
		together: TOGETHER_AI,
		google: GOOGLE,
		groq: GROQ,
		cohere: COHERE,
		fireworks: FIREWORKS_AI,
		perplexity: PERPLEXITY,
		ollama: OLLAMA
	};

	const provider = providerMap[providerString.toLowerCase()];
	if (!provider) {
		throw new Error(`Unknown provider: ${providerString}`);
	}
	return provider;
}
