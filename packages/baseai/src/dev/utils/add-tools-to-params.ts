import type { Pipe } from 'types/pipe';
import { getProvider } from './get-provider';
import { getSupportedToolSettings, hasToolSupport } from './has-tool-support';
import type { ModelParams, Tool } from 'types/providers';

export function addToolsToParams(modelParams: ModelParams, pipe: Pipe) {
	if (!pipe.tools.length) return;

	const [providerString, modelName] = pipe.model.split(':');
	const provider = getProvider(providerString);

	// Check if the model supports tool calls
	const hasToolCallSupport = hasToolSupport({
		modelName,
		provider
	});

	if (hasToolCallSupport) {
		const { hasParallelToolCallSupport, hasToolChoiceSupport } =
			getSupportedToolSettings({
				modelName,
				provider
			});

		if (hasParallelToolCallSupport) {
			modelParams.parallel_tool_calls = pipe.parallel_tool_calls;
		}

		if (hasToolChoiceSupport) {
			modelParams.tool_choice = pipe.tool_choice;
		}

		modelParams.tools = pipe.tools as Tool[];
	}
}
