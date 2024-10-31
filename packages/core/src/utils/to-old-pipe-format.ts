import type {Pipe, PipeOld} from '../../types/pipes';
import {getProvider} from './get-provider';

/**
 * Converts a new pipe format to an old pipe format.
 *
 * @param newFormat - The new pipe format to convert.
 * @returns The converted old pipe format.
 */
export function toOldPipeFormat(newFormat: Pipe): PipeOld {
	const [providerString, modelName] = newFormat.model.split(':');

	return {
		name: newFormat.name,
		description: newFormat.description || '',
		status: newFormat.status,
		meta: {
			stream: newFormat.stream,
			json: newFormat.json,
			store: newFormat.store,
			moderate: newFormat.moderate,
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
				stop: newFormat.stop,
			},
			tool_choice: newFormat.tool_choice,
			parallel_tool_calls: newFormat.parallel_tool_calls,
		},
		messages: newFormat.messages,
		variables: newFormat.variables,
		tools: newFormat.tools,
		functions: newFormat.tools,
		memorysets: newFormat.memory.map(memory => memory.name),
	};
}
