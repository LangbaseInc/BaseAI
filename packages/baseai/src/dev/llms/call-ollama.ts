import { dlog } from '../utils/dlog';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { handleProviderRequest } from '../utils/provider-handlers/provider-request-handler';

import { OLLAMA } from '../data/models';
import { handleLlmError } from './utils';
import type { Message } from 'types/pipe';
import type { ModelParams } from 'types/providers';

export async function callOllama({
	pipe,
	messages,
	llmApiKey,
	stream
}: {
	pipe: any;
	llmApiKey: string;
	stream: boolean;
	messages: Message[];
}) {
	try {
		const modelParams = buildModelParams(pipe, stream, messages);

		// Transform params according to provider's format
		const transformedRequestParams = transformToProviderRequest({
			provider: OLLAMA,
			params: modelParams,
			fn: 'chatComplete'
		});
		dlog('ollama request params', transformedRequestParams);

		const providerOptions = { provider: OLLAMA, llmApiKey };
		return await handleProviderRequest({
			providerOptions,
			inputParams: modelParams,
			endpoint: 'chatComplete',
			transformedRequestParams
		});
	} catch (error: any) {
		handleLlmError({ error, provider: OLLAMA });
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
