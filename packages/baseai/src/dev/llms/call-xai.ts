import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { X_AI } from '../data/models';
import { handleLlmError } from './utils';
import type { Message } from 'types/pipe';
import type { ModelParams } from 'types/providers';
import { addToolsToParams } from '../utils/add-tools-to-params';

export async function callXAI({
	pipe,
	stream,
	llmApiKey,
	messages
}: {
	pipe: any;
	stream: boolean;
	llmApiKey: string;
	messages: Message[];
}) {
	try {
		const modelParams = buildModelParams(pipe, stream, messages);

		// LLM.
		const groq = new OpenAI({
			apiKey: llmApiKey,
			baseURL: 'https://api.x.ai/v1'
		});

		// Add tools (functions) to modelParams
		addToolsToParams(modelParams, pipe);
		dlog('modelParams', modelParams);

		return await groq.chat.completions.create(modelParams as any);
	} catch (error: any) {
		handleLlmError({ error, provider: X_AI });
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
