import { dlog } from '../utils/dlog';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { handleProviderRequest } from '../utils/provider-handlers/provider-request-handler';
import { ANTHROPIC } from '../data/models';
import { handleLlmError } from './utils';
import type { ModelParams } from 'types/providers';
import type { Message } from 'types/pipe';

export async function callAnthropic({
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
			provider: ANTHROPIC,
			params: modelParams,
			fn: 'chatComplete'
		});
		dlog('Anthropic request params', transformedRequestParams);

		const providerOptions = { provider: ANTHROPIC, llmApiKey };

		return await handleProviderRequest({
			providerOptions,
			inputParams: modelParams,
			endpoint: 'chatComplete',
			transformedRequestParams
		});
	} catch (error: any) {
		handleLlmError({ error, provider: ANTHROPIC });
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
