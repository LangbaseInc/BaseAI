import type { Pipe, ToolCall } from 'types/pipe';
import { getProvider } from './get-provider';
import { getSupportedToolSettings, hasToolSupport } from './has-tool-support';
import type { ModelParams } from 'types/providers';
import type { PipeTool } from 'types/tools';

export function addToolsToParams(
	modelParams: ModelParams,
	pipe: Pipe,
	paramsTools: PipeTool[] | undefined
) {
	const pipeTools = pipe.tools as unknown as string[];
	const hasParamsTools = paramsTools && paramsTools.length > 0;

	// 1. If no tools are provided, return the modelParams as is
	if (!hasParamsTools && !pipeTools.length) return modelParams;

	const [providerString, modelName] = pipe.model.split(':');
	const provider = getProvider(providerString);

	// Check if the model supports tool calls
	const hasToolCallSupport = hasToolSupport({
		modelName,
		provider
	});

	// 2. If the model does not support tool calls, return the modelParams as is
	if (!hasToolCallSupport) return modelParams;

	// If tools are provided in request param, prioritize and use them
	if (hasParamsTools) {
		modelParams.tools = paramsTools as ToolCall[];
	}

	// If tools are not provided in request param, use the tools from the pipe config
	if (!hasParamsTools && pipeTools.length) {
		modelParams.tools = pipe.tools as ToolCall[];
	}

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
}
