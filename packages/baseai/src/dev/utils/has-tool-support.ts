import { modelsByProvider } from '@/data/models';

export function hasModelToolSupport({
	provider,
	modelName
}: {
	modelName: string;
	provider: string;
}) {
	const toolSupportedModels = modelsByProvider[provider].filter(
		model => model.toolSupport
	);

	const providerModel = toolSupportedModels.find(
		model => model.id === modelName
	);

	if (!providerModel) {
		return {
			hasParallelToolCallSupport: false,
			hasToolChoiceSupport: false
		};
	}

	return {
		hasToolChoiceSupport: providerModel.toolSupport?.toolChoice,
		hasParallelToolCallSupport: providerModel.toolSupport?.parallelToolCalls
	};
}
