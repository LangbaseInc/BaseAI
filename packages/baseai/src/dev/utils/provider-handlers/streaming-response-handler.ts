import type { Context } from 'hono';
import { ApiError } from '@/dev/hono/errors';
import type { HonoEnv } from '@/dev/hono/env';

/**
 * Handles streaming response from OpenAI and other providers.
 *
 * It handles the two cases accordingly
 * ReadableStream: Return as it is
 * Async Iterator: Convert to OpenAI SSE format Readable stream and return it
 * Returns the stream in OpenAI API SSE format
 *
 * @param {Response} response - The Streaming response.
 * @param {string} provider - The provider name string.
 * @param {any | undefined} headers - Optional headers to send with the streamed response
 * @returns {Promise<any>} - A promise that resolves to the processed response.
 */
export const handleStreamingResponse = async ({
	c,
	response,
	headers
}: {
	c: Context<HonoEnv>;
	response: any;
	headers?: any;
}): Promise<any> => {
	try {
		// Response is from our provider transform
		if (response instanceof ReadableStream) {
			// Dulplicate the stream because a stream can only be consumed once.
			const [streamForResponse] = response.tee();

			return new Response(streamForResponse, {
				// Send headers if provided
				headers: { 'content-type': 'text/event-stream', ...headers }
			});
		} else {
			/**
			 * Response is from OpenAI SDK:
			 * It is an async iterator
			 * We transform it into OpenAI SSE format and return it
			 */
			// Handle async iterators (e.g., from OpenAI SDK)
			const stream = new ReadableStream({
				async start(controller) {
					const encoder = new TextEncoder();
					try {
						for await (const chunk of response) {
							const data = JSON.stringify(chunk);
							controller.enqueue(
								encoder.encode(`data: ${data}\n\n`)
							);
						}
					} catch (error) {
						console.error('Error processing stream:', error);
						controller.error(error);
					} finally {
						controller.enqueue(encoder.encode('data: [DONE]\n\n'));
						controller.close();
					}
				}
			});

			return new Response(stream, {
				// Send headers if provided
				headers: { 'content-type': 'text/event-stream', ...headers }
			});
		}
	} catch (error) {
		console.error('Error in handleStreamingResponse:', error);
		throw new ApiError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `Error while streaming: ${error}`
		});
	}
};
