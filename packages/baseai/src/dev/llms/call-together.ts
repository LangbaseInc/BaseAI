import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { GROQ } from '../data/models';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { Message } from 'types/pipe';
import type { ModelParams } from 'types/providers';

export async function callTogether({
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

		// LLM.
		const together = new OpenAI({
			apiKey: llmApiKey,
			baseURL: 'https://api.together.xyz/v1'
		});

		// Together behaves weirdly with stop value. Omitting it.
		delete modelParams['stop'];
		applyJsonModeIfEnabled(modelParams, pipe);
		dlog('modelParams', modelParams);

		return await together.chat.completions.create(modelParams as any);
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
