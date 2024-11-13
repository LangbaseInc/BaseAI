import { ApiError } from '@/dev/hono/errors';
import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { moderate } from '../utils/moderate';
import { OPEN_AI } from '../data/models';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { Message, Pipe } from 'types/pipe';
import type { ModelParams } from 'types/providers';
import { addToolsToParams } from '../utils/add-tools-to-params';

export async function callOpenAI({
	pipe,
	stream,
	llmApiKey,
	messages
}: {
	pipe: Pipe;
	stream: boolean;
	llmApiKey: string;
	messages: Message[];
}) {
	try {
		validateInput(pipe, messages);
		const openai = new OpenAI({ apiKey: llmApiKey });
		await moderateContent(openai, messages, pipe.moderate);

		const modelParams = buildModelParams(pipe, stream, messages);
		addToolsToParams(modelParams, pipe);
		applyJsonModeIfEnabled(modelParams, pipe);

		dlog('modelParams', modelParams);
		return await openai.chat.completions.create(modelParams as any);
	} catch (error: any) {
		handleLlmError({ error, provider: OPEN_AI });
	}
}

function validateInput(pipe: Pipe, messages: Message[]) {
	if (!pipe || !pipe.model || !messages || messages.length === 0) {
		throw new ApiError({
			code: 'BAD_REQUEST',
			message: 'Invalid input: pipe or messages are missing or empty'
		});
	}
}

async function moderateContent(
	openai: OpenAI,
	messages: Message[],
	shouldModerate: boolean = true
) {
	if (shouldModerate) {
		const { flagged, reason } = await moderate({
			openai,
			prompt: { messages, variables: [] }
		});

		if (flagged) {
			throw new ApiError({
				code: 'BAD_REQUEST',
				message: reason
			});
		}
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
		model: model || 'gpt-4o-mini',
		top_p,
		max_tokens,
		temperature,
		presence_penalty,
		frequency_penalty,
		stop
	};
}
