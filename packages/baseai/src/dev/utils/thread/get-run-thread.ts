import { ApiError } from '@/dev/hono/errors';
import type { Pipe } from '@/dev/routes/beta/pipes/run';
import type { SimilarChunk } from '@/utils/memory/db/lib';
import type { Message } from 'types/pipe';
import { dlog } from '../dlog';
import { getPipeFewShotsMessages } from './get-few-shot-messages';
import { getSystemPromptMessage } from './get-system-prompt';

export function getRunThread({
	pipe,
	messages,
	similarChunks
}: {
	pipe: Pipe;
	messages: Message[];
	similarChunks: SimilarChunk[] | undefined;
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

		return messagesThread;
	} catch (error: any) {
		dlog('Error get-run-thread.ts:', error);

		throw new ApiError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `Something unexpected happened. Error generating thread of messages.`
		});
	}
}
