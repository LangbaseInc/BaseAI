import type { ModelParams } from 'types/providers';
import { ApiError } from '../hono/errors';
import { dlog } from '../utils/dlog';
import { isJsonModeOn } from '../utils/is-json-mode';

export function handleLlmError({
	error,
	provider
}: {
	error: any;
	provider: string;
}) {
	dlog(`Error call-${provider}.ts:`, error);
	throw new ApiError({
		code: 'BAD_REQUEST',
		message: `Error from ${provider}: ${error.message}`
	});
}

export function applyJsonModeIfEnabled(modelParams: ModelParams, pipe: any) {
	const hasJsonMode = isJsonModeOn({
		currentModel: pipe.model.name,
		jsonMode: pipe.meta.json || false
	});

	if (hasJsonMode) {
		modelParams.response_format = { type: 'json_object' };
	}
}

export function applyJsonModeIfEnabledForGoogle(
	transformedRequestParams: any,
	pipe: any
) {
	const hasJsonMode = isJsonModeOn({
		currentModel: pipe.model.name,
		jsonMode: pipe.meta.json || false
	});

	if (hasJsonMode) {
		transformedRequestParams.generationConfig = {
			...transformedRequestParams.generationConfig,
			responseMimeType: 'application/json'
		};
	}
}
