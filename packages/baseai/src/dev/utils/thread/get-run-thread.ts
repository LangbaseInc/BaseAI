import { ApiError } from '@/dev/hono/errors';
import type { Pipe } from '@/dev/routes/beta/pipes/run';
import type { SimilarChunk } from '@/utils/memory/db/lib';
import type { Message, VariablesI } from 'types/pipe';
import { dlog } from '../dlog';
import { getPipeFewShotsMessages } from './get-few-shot-messages';
import { getSystemPromptMessage } from './get-system-prompt';
import { processMessages } from './process-messages';

export function getRunThread({
	pipe,
	messages,
	similarChunks,
	variables
}: {
	pipe: Pipe;
	messages: Message[];
	similarChunks: SimilarChunk[] | undefined;
	variables?: VariablesI;
}) {
	try {
		const systemPromptMessage = getSystemPromptMessage({
			pipe,
			similarChunks
		});
		const pipeFewShotsMessages = getPipeFewShotsMessages(pipe);

		const messagesThread = [
			// Messages in the pipe
			...systemPromptMessage,
			...pipeFewShotsMessages,
			// Messages sent with the request
			...messages
		];

		const { messages: messagesThreadWithVars } = processMessages({
			pipe,
			messages: messagesThread,
			variables
		});

		return messagesThreadWithVars;
	} catch (error: any) {
		dlog('Error get-run-thread.ts:', error);

		throw new ApiError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `Something unexpected happened. Error generating thread of messages.`
		});
	}
}
