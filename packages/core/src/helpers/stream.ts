import {ChatCompletionStream} from 'openai/lib/ChatCompletionStream';
import {ChunkStream} from 'src/pipes';
import {Stream} from 'openai/streaming';
import {ToolCall} from 'types/pipes';

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

/**
 * Handles the response stream from a given `Response` object.
 *
 * @param {Object} params - The parameters for handling the response stream.
 * @param {Response} params.response - The API response to handle.
 * @param {boolean} params.rawResponse - Optional flag to include raw response headers.
 *
 * @returns {Object} An object containing the processed stream, thread ID, and optionally raw response headers.
 * @returns {ReadableStream<any>} return.stream - The readable stream created from the response.
 * @returns {string | null} return.threadId - The thread ID extracted from the response headers.
 * @returns {Object} [return.rawResponse] - Optional raw response headers.
 * @returns {Record<string, string>} return.rawResponse.headers - The headers from the raw response.
 */
export function handleResponseStream({
	response,
	rawResponse,
}: {
	response: Response;
	rawResponse?: boolean;
}): {
	stream: any;
	threadId: string | null;
	rawResponse?: {
		headers: Record<string, string>;
	};
} {
	const controller = new AbortController();
	const streamSSE = Stream.fromSSEResponse(response, controller);
	const stream = streamSSE.toReadableStream();

	const result: {
		stream: ReadableStream<any>;
		threadId: string | null;
		rawResponse?: {
			headers: Record<string, string>;
		};
	} = {
		stream,
		threadId: response.headers.get('lb-thread-id'),
	};
	if (rawResponse) {
		result.rawResponse = {
			headers: Object.fromEntries(response.headers.entries()),
		};
	}
	return result;
}

/**
 * Asynchronously retrieves tool calls from a readable stream.
 *
 * This function processes a stream of data and extracts tool call information,
 * organizing it into an array of `ToolCall` objects. Each `ToolCall` object
 * contains details about a specific tool call, including its ID, type, and
 * function information.
 *
 * @param stream - The readable stream containing the data to be processed.
 * @returns A promise that resolves to an array of `ToolCall` objects.
 */
export async function getToolsFromStream(
	stream: ReadableStream<any>,
): Promise<ToolCall[]> {
	const toolCalls = [] as ToolCall[];
	let streamText = getRunner(stream);

	for await (const chunk of streamText) {
		if (chunk.choices[0]?.delta?.tool_calls) {
			const allToolCalls = chunk.choices[0].delta.tool_calls;

			for (const toolCall of allToolCalls) {
				const index = toolCall.index;

				if (!toolCalls[index]) {
					toolCalls[index] = {
						id: '',
						type: 'function',
						function: {name: '', arguments: ''},
					};
				}
				if (toolCall.id) {
					toolCalls[index].id = toolCall.id;
				}
				if (toolCall.type) {
					toolCalls[index].type = toolCall.type;
				}
				if (toolCall.function) {
					if (toolCall.function.name) {
						toolCalls[index].function.name = toolCall.function.name;
					}
					if (toolCall.function.arguments) {
						toolCalls[index].function.arguments +=
							toolCall.function.arguments;
					}
				}
			}
		}
	}

	return toolCalls;
}
