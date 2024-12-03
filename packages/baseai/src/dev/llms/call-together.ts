import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { GROQ } from '../data/models';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { Message, Pipe } from 'types/pipe';
import type { ModelParams } from 'types/providers';
import { addToolsToParams } from '../utils/add-tools-to-params';
import type { PipeTool } from 'types/tools';

export async function callTogether({
	pipe,
	messages,
	llmApiKey,
	stream,
	paramsTools
}: {
	pipe: Pipe;
	llmApiKey: string;
	stream: boolean;
	messages: Message[];
	paramsTools: PipeTool[] | undefined;
}) {
	try {
		const modelParams = buildModelParams(pipe, stream, messages);

		// LLM.
		const together = new OpenAI({
			apiKey: llmApiKey,
			baseURL: 'https://api.together.xyz/v1'
		});

		// Together behaves weirdly with stop value. Omitting it.
		delete modelParams['stop'];
		applyJsonModeIfEnabled(modelParams, pipe);
		addToolsToParams(modelParams, pipe, paramsTools);
		dlog('modelParams', modelParams);

		return await together.chat.completions.create(modelParams as any);
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
