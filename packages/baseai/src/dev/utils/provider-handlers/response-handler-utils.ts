import { REQUEST_TIMEOUT_STATUS_CODE } from '../../data/globals';
import {
	AZURE_OPEN_AI,
	BEDROCK,
	COHERE,
	DEEPINFRA,
	GOOGLE,
	PERPLEXITY
} from '../../data/models';
import { dlog } from '../dlog';

/**
 * Handles non-streaming responses. Applies the appropriate response transformer to the response.
 * Returns a mapped response in OpenAI format
 * @param {Response} response - The HTTP response recieved from LLM.
 * @param {Function | undefined} responseTransformer - The response transform function given in provider/index.ts.
 * @returns {Promise<any>} - A promise that resolves to the processed response.
 */

export async function handleNonStreamingMode({
	response,
	responseTransformer
}: {
	response: Response;
	responseTransformer: Function | undefined;
}): Promise<any> {
	// 408 is thrown whenever a request takes more than request_timeout to respond.
	// In that case, response thrown by gateway is already in OpenAI format.
	// So no need to transform it again.
	if (response.status === REQUEST_TIMEOUT_STATUS_CODE) {
		return response;
	}
	let responseBodyJson = await response.json();

	dlog('original provider response', responseBodyJson);

	if (responseTransformer) {
		responseBodyJson = responseTransformer(
			responseBodyJson,
			response.status,
			response.headers
		);
	}

	return responseBodyJson;
}

/**
 * Handles the streaming mode for a response.
 *
 * @param response - The response object.
 * @param provider - The provider string.
 * @param responseTransformer - The response transformer function.
 * @param requestURL - The request URL string.
 * @returns A promise that resolves to the transformed response or the readable stream.
 * @throws An error if the response format is invalid and the body is not found.
 */
export async function handleStreamingMode(
	response: Response,
	provider: string,
	responseTransformer: Function | undefined,
	requestURL: string
): Promise<any> {
	const splitPattern = getStreamModeSplitPattern(provider, requestURL);
	const fallbackChunkId = Date.now().toString();

	if (!response.body) {
		throw new Error('Response format is invalid. Body not found');
	}
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const reader = response.body.getReader();
	const isSleepTimeRequired = provider === AZURE_OPEN_AI ? true : false;
	const encoder = new TextEncoder();

	(async () => {
		for await (const chunk of readStream(
			reader,
			splitPattern,
			responseTransformer,
			isSleepTimeRequired,
			fallbackChunkId
		)) {
			await writer.write(encoder.encode(chunk));
		}
		writer.close();
	})();

	// Convert GEMINI/COHERE json stream to text/event-stream
	if ([GOOGLE, COHERE, BEDROCK].includes(provider) && responseTransformer) {
		return readable;
		// return new Response(readable, {
		// 	...response,
		// 	headers: new Headers({
		// 		...Object.fromEntries(response.headers),
		// 		'content-type': 'text/event-stream',
		// 	}),
		// });
	}

	return readable;
}

/**
 * Returns the split pattern based on the provider and request URL.
 * @param provider - The provider name.
 * @param requestURL - The request endpoint URL.
 * @returns The split pattern.
 */
export const getStreamModeSplitPattern = (
	provider: string,
	requestURL: string
) => {
	let splitPattern = '\n\n';
	if (provider === COHERE) {
		splitPattern = '\n';
	}
	if (provider === GOOGLE) {
		splitPattern = '\r\n';
	}

	if (provider === PERPLEXITY) {
		splitPattern = '\r\n\r\n';
	}

	if (provider === DEEPINFRA) {
		splitPattern = '\r\n\r\n';
	}

	return splitPattern;
};

/**
 * Asynchronously reads a stream and yields chunks of data based on a split pattern.
 * @param reader The ReadableStreamDefaultReader to read from.
 * @param splitPattern The pattern used to split the chunks of data.
 * @param transformFunction An optional function to transform each chunk of data.
 * @param isSleepTimeRequired A boolean indicating whether sleep time is required between chunks.
 * @param fallbackChunkId The ID to use for fallback chunks.
 * @yields The chunks of data read from the stream.
 */
export async function* readStream(
	reader: ReadableStreamDefaultReader,
	splitPattern: string,
	transformFunction: Function | undefined,
	isSleepTimeRequired: boolean,
	fallbackChunkId: string
) {
	let buffer = '';
	let decoder = new TextDecoder();
	let isFirstChunk = true;

	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (buffer.length > 0) {
				if (transformFunction) {
					yield transformFunction(buffer, fallbackChunkId);
				} else {
					yield buffer;
				}
			}
			break;
		}

		buffer += decoder.decode(value, { stream: true });
		// keep buffering until we have a complete chunk

		while (buffer.split(splitPattern).length > 1) {
			let parts = buffer.split(splitPattern);
			let lastPart = parts.pop() ?? ''; // remove the last part from the array and keep it in buffer
			for (let part of parts) {
				// Some providers send ping event which can be ignored during parsing

				if (part.length > 0) {
					if (isFirstChunk) {
						isFirstChunk = false;
						await new Promise(resolve => setTimeout(resolve, 25));
					} else if (isSleepTimeRequired) {
						await new Promise(resolve => setTimeout(resolve, 1));
					}

					if (transformFunction) {
						const transformedChunk = transformFunction(
							part,
							fallbackChunkId
						);
						if (transformedChunk !== undefined) {
							yield transformedChunk;
						}
					} else {
						yield part + splitPattern;
					}
				}
			}

			buffer = lastPart; // keep the last part (after the last '\n\n') in buffer
		}
	}
}

// export async function handleJSONToStreamResponse(response: Response, provider: string, responseTransformerFunction: Function): Promise<Response> {
// 	const { readable, writable } = new TransformStream();
// 	const writer = writable.getWriter();
// 	const encoder = new TextEncoder();
// 	const responseJSON: OpenAIChatCompleteResponse = await response.clone().json();
// 	const streamChunkArray = responseTransformerFunction(responseJSON, provider);

// 	(async () => {
// 		for (const chunk of streamChunkArray) {
// 			await writer.write(encoder.encode(chunk));
// 		}
// 		writer.close();
// 	})();

// 	return new Response(readable, {
// 		headers: new Headers({
// 			...Object.fromEntries(response.headers),
// 			'content-type': CONTENT_TYPES.EVENT_STREAM
// 		})
// 	});
// }

// function readUInt32BE(buffer: Uint8Array, offset: number) {
// 	return (
// 		(buffer[offset] << 24) |
// 		(buffer[offset + 1] << 16) |
// 		(buffer[offset + 2] << 8) |
// 		buffer[offset + 3]
// 	) >>> 0; // Ensure the result is an unsigned integer
// }

// function getPayloadFromAWSChunk(chunk: Uint8Array): string {
// 	const decoder = new TextDecoder();
// 	const chunkLength = readUInt32BE(chunk, 0);
// 	const headersLength = readUInt32BE(chunk, 4);

// 	// prelude 8 + Prelude crc 4 = 12
// 	const headersEnd = 12 + headersLength;

// 	const payloadLength = chunkLength - headersEnd - 4; // Subtracting 4 for the message crc
// 	const payload = chunk.slice(headersEnd, headersEnd + payloadLength);
// 	return decoder.decode(payload);
// }

// function concatenateUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
// 	const result = new Uint8Array(a.length + b.length);
// 	result.set(a, 0); // Copy contents of array 'a' into 'result' starting at index 0
// 	result.set(b, a.length); // Copy contents of array 'b' into 'result' starting at index 'a.length'
// 	return result;
// }

// export async function* readAWSStream(reader: ReadableStreamDefaultReader, transformFunction: Function | undefined, fallbackChunkId: string) {
// 	let buffer = new Uint8Array();
// 	let expectedLength = 0;
// 	while (true) {
// 		const { done, value } = await reader.read();
// 		if (done) {
// 			if (buffer.length) {
// 				expectedLength = readUInt32BE(buffer, 0);
// 				while (buffer.length >= expectedLength && buffer.length !== 0) {
// 					const data = buffer.subarray(0, expectedLength);
// 					buffer = buffer.subarray(expectedLength);
// 					expectedLength = readUInt32BE(buffer, 0);
// 					const payload = Buffer.from(JSON.parse(getPayloadFromAWSChunk(data)).bytes, 'base64').toString();
// 					if (transformFunction) {
// 						const transformedChunk = transformFunction(payload, fallbackChunkId);
// 						if (Array.isArray(transformedChunk)) {
// 							for (var item of transformedChunk) {
// 								yield item;
// 							}
// 						} else {
// 							yield transformedChunk;
// 						}
// 					} else {
// 						yield data;
// 					}
// 				}
// 			}
// 			break;
// 		}

// 		if (expectedLength === 0) {
// 			expectedLength = readUInt32BE(value, 0);
// 		}

// 		buffer = concatenateUint8Arrays(buffer, value);

// 		while (buffer.length >= expectedLength && buffer.length !== 0) {
// 			const data = buffer.subarray(0, expectedLength);
// 			buffer = buffer.subarray(expectedLength);

// 			expectedLength = readUInt32BE(buffer, 0);
// 			const payload = Buffer.from(JSON.parse(getPayloadFromAWSChunk(data)).bytes, 'base64').toString();

// 			if (transformFunction) {
// 				const transformedChunk = transformFunction(payload, fallbackChunkId);
// 				if (Array.isArray(transformedChunk)) {
// 					for (var item of transformedChunk) {
// 						yield item;
// 					}
// 				} else {
// 					yield transformedChunk;
// 				}
// 			} else {
// 				yield data;
// 			}
// 		}
// 	}
// }

// export async function handleTextResponse(response: Response, responseTransformer: Function | undefined) {
// 	const text = await response.text();

// 	if (responseTransformer) {
// 		const transformedText = responseTransformer({ "html-message": text }, response.status);
// 		return new Response(JSON.stringify(transformedText), {
// 			...response,
// 			status: response.status,
// 			headers: new Headers({
// 				...Object.fromEntries(response.headers),
// 				'content-type': "application/json"
// 			})
// 		});
// 	}

// 	return new Response(text, response);
// }

// export async function handleAudioResponse(response: Response) {
// 	return new Response(response.body, response);
// }

// export async function handleOctetStreamResponse(response: Response) {
// 	return new Response(response.body, response);
// }

// export async function handleImageResponse(response: Response) {
// 	return new Response(response.body, response);
// }
