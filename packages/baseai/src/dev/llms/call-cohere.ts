import { handleProviderRequest } from '../utils/provider-handlers/provider-request-handler';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { dlog } from '../utils/dlog';
import { COHERE } from '../data/models';
import { handleLlmError } from './utils';
import type { ModelParams } from 'types/providers';
import type { Message, Pipe } from 'types/pipe';

export async function callCohere({
	pipe,
	messages,
	llmApiKey,
	stream
}: {
	pipe: Pipe;
	llmApiKey: string;
	messages: Message[];
	stream: boolean;
}) {
	try {
		const modelParams = buildModelParams(pipe, stream, messages);

		// Transform params according to provider's format
		const transformedRequestParams = transformToProviderRequest({
			provider: COHERE,
			params: modelParams,
			fn: 'chatComplete'
		});
		dlog('Cohere request params', transformedRequestParams);

		const providerOptions = { provider: COHERE, llmApiKey };

		return await handleProviderRequest({
			providerOptions,
			inputParams: modelParams,
			endpoint: 'chatComplete',
			transformedRequestParams
		});
	} catch (error: any) {
		handleLlmError({ error, provider: COHERE });
	}
}

function buildModelParams(
	pipe: Pipe,
	stream: boolean,
	messages: Message[]
): ModelParams {
	const model = pipe.model.split(':')[1];
	const {
		top_p,
		max_tokens,
		temperature,
		presence_penalty,
		frequency_penalty,
		stop
	} = pipe;
	return {
		messages,
		stream,
		model,
		top_p,
		max_tokens,
		temperature,
		presence_penalty,
		frequency_penalty,
		stop
	};
}
