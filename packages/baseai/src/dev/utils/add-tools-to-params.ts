import { getSupportedToolSettings, hasToolSupport } from './has-tool-support';
import type { ModelParams } from 'types/providers';

export function addToolsToParams(modelParams: ModelParams, pipe: any) {
	if (!pipe.functions.length) return;

	// Check if the model supports tool calls
	const hasToolCallSupport = hasToolSupport({
		modelName: pipe.model.name,
		provider: pipe.model.provider
	});

	if (hasToolCallSupport) {
		const { hasParallelToolCallSupport, hasToolChoiceSupport } =
			getSupportedToolSettings({
				modelName: pipe.model.name,
				provider: pipe.model.provider
			});

		if (hasParallelToolCallSupport) {
			modelParams.parallel_tool_calls = pipe.model.parallel_tool_calls;
		}

		if (hasToolChoiceSupport) {
			modelParams.tool_choice = pipe.model.tool_choice;
		}

		modelParams.tools = pipe.functions;
	}
}
