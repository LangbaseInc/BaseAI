import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { GROQ } from '../data/models';
import transformToProviderRequest from '../utils/provider-handlers/transfrom-to-provider-request';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { ModelParams } from 'types/providers';
import type { Message, Pipe } from 'types/pipe';

export async function callGroq({
	pipe,
	messages,
	llmApiKey,
	stream
}: {
	pipe: Pipe;
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
