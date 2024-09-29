import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { GROQ } from '../data/models';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { ModelParams } from 'types/providers';
import type { Message } from 'types/pipe';

export async function callGroq({
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
		const groq = new OpenAI({
			apiKey: llmApiKey,
			baseURL: 'https://api.groq.com/openai/v1'
		});
		applyJsonModeIfEnabled(modelParams, pipe);

		// Transform params according to provider's format
		const transformedRequestParams = transformToProviderRequest({
			provider: GROQ,
			params: modelParams as ModelParams,
			fn: 'chatComplete'
		});
		dlog('Groq request params', transformedRequestParams);

		return await groq.chat.completions.create(
			transformedRequestParams as any
		);
	} catch (error: any) {
		handleLlmError({ error, provider: GROQ });
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
