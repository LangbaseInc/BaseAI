import { ApiError } from '@/dev/hono/errors';
import OpenAI from 'openai';
import { dlog } from '../utils/dlog';
import { moderate } from '../utils/moderate';
import { OPEN_AI } from '../data/models';
import { applyJsonModeIfEnabled, handleLlmError } from './utils';
import type { Message } from 'types/pipe';
import type { ModelParams } from 'types/providers';

export async function callOpenAI({
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
		validateInput(pipe, messages);
		const openai = new OpenAI({ apiKey: llmApiKey });
		await moderateContent(openai, messages, pipe.meta.moderate);

		const modelParams = buildModelParams(pipe, stream, messages);
		addToolsToParams(modelParams, pipe);
		applyJsonModeIfEnabled(modelParams, pipe);

		dlog('modelParams', modelParams);
		return await openai.chat.completions.create(modelParams as any);
	} catch (error: any) {
		handleLlmError({ error, provider: OPEN_AI });
	}
}

function validateInput(pipe: any, messages: Message[]) {
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
	pipe: any,
	stream: boolean,
	messages: Message[]
): ModelParams {
	return {
		messages,
		stream,
		model: pipe.model.name || 'gpt-4o-mini',
		...pipe.model.params
	};
}

function addToolsToParams(modelParams: ModelParams, pipe: any) {
	if (!pipe.functions.length) return;

	modelParams.tools = pipe.functions;
	modelParams.tool_choice = pipe.model.tool_choice;
	modelParams.parallel_tool_calls = pipe.model.parallel_tool_calls;
}
