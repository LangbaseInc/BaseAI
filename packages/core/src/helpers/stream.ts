import {ChatCompletionStream} from 'openai/lib/ChatCompletionStream';
import {ChunkStream} from 'src/pipes';

export interface Runner extends ChatCompletionStream<null> {}

/**
 * Converts a ReadableStream into a Runner.
 *
 * @param readableStream - The ReadableStream to convert.
 * @returns The converted Runner.
 */
export const fromReadableStream = (readableStream: ReadableStream): Runner => {
	return ChatCompletionStream.fromReadableStream(readableStream);
};

/**
 * Returns a runner for the given readable stream.
 *
 * @param readableStream - The readable stream to create a runner for.
 * @returns A runner for the given readable stream.
 */
export const getRunner = (readableStream: ReadableStream) => {
	return fromReadableStream(readableStream);
};

/**
 * Retrieves the text part from a given ChunkStream.
 *
 * @param chunk - The ChunkStream object.
 * @returns The text content of the first choice's delta, or an empty string if it doesn't exist.
 */
export const getTextPart = (chunk: ChunkStream) => {
	return chunk.choices[0]?.delta?.content || '';
};
