import { dlog } from '../utils/dlog';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { handleProviderRequest } from '../utils/provider-handlers/provider-request-handler';
import { GOOGLE } from '../data/models';
import { applyJsonModeIfEnabledForGoogle, handleLlmError } from './utils';
import type { ModelParams } from 'types/providers';
import type { Message } from 'types/pipe';

export async function callGoogle({
	pipe,
	messages,
	llmApiKey,
	stream
}: {
	pipe: any;
	stream: boolean;
	llmApiKey: string;
	messages: Message[];
}) {
	try {
		const modelParams = buildModelParams(pipe, stream, messages);

		// Transform params according to provider's format
		const transformedRequestParams = transformToProviderRequest({
			provider: GOOGLE,
			params: modelParams,
			fn: 'chatComplete'
		});

		applyJsonModeIfEnabledForGoogle(transformedRequestParams, pipe);

		dlog('Google request params', transformedRequestParams);

		const providerOptions = { provider: GOOGLE, llmApiKey };

		return await handleProviderRequest({
			providerOptions,
			inputParams: modelParams,
			endpoint: 'chatComplete',
			transformedRequestParams
		});
	} catch (error: any) {
		improveGoogleErrorMessage(error);
		handleLlmError({ error, provider: GOOGLE });
	}
}

function buildModelParams(
	pipe: any,
	stream: boolean,
	messages: Message[]
): ModelParams {
	return {
		messages,
		stream,
		model: pipe.model.name,
		...pipe.model.params
	};
}

function improveGoogleErrorMessage(error: any) {
	if (
		error.message.includes(
			`models/gemini-1.5-pro-latest is not found for API version v1`
		)
	) {
		error.message = `You don't have access to gemini-1.5-pro-latest by Google Cloud AI. Contact Google support.`;
	}
	if (
		error.message.includes(
			`models/gemini-1.5-flash is not found for API version v1`
		)
	) {
		error.message = `You don't have access to gemini-1.5-flash by Google Cloud AI. Contact Google support.`;
	}
}
