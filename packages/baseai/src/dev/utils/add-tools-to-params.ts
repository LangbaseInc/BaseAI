import { hasModelToolSupport } from './has-tool-support';
import type { ModelParams } from 'types/providers';

export function addToolsToParams(modelParams: ModelParams, pipe: any) {
	if (!pipe.functions.length) return;

	// Check if the model supports tool calls
	const { hasToolChoiceSupport, hasParallelToolCallSupport } =
		hasModelToolSupport({
			modelName: pipe.model.name,
			provider: pipe.model.provider
		});

	const hasToolSupport = hasToolChoiceSupport || hasParallelToolCallSupport;

	if (hasToolSupport) {
		if (hasParallelToolCallSupport) {
			modelParams.parallel_tool_calls = pipe.model.parallel_tool_calls;
		}

		if (hasToolChoiceSupport) {
			modelParams.tool_choice = pipe.model.tool_choice;
		}

		modelParams.tools = pipe.functions;
	}
}
