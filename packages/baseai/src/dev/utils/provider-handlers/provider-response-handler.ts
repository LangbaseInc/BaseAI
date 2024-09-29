import type { ModelParams } from '@/types/providers';
import {
	handleNonStreamingMode,
	handleStreamingMode
} from './response-handler-utils';
import Providers from '@/dev/providers';
import { dlog } from '../dlog';

/**
 * Handles various types of responses based on the specified parameters
 * and returns a mapped response in OpenAI format
 * @param {Response} response - The HTTP response recieved from LLM.
 * @param {boolean} streamingMode - Indicates whether streaming mode is enabled.
 * @param {string} provider - The provider name string.
 * @param {string | undefined} responseTransformer - The response transform name given in provider/index.ts. Usually is LLM endpoint. For example GoogleChatCompleteResponseTransform.
 * @param {string} requestURL - The URL of the original LLM request.
 * @returns {Promise<any>} - A promise that resolves to the processed response.
 */
export function handleProviderResponse({
	response,
	streamingMode,
	provider,
	responseTransformer,
	requestURL,
	modelParams
}: {
	response: Response;
	streamingMode: boolean;
	provider: string;
	responseTransformer: string | undefined;
	requestURL: string;
	modelParams: ModelParams;
}): Promise<any> {
	try {
		let responseTransformerFunction: Function | undefined;
		// const responseContentType = response.headers?.get("content-type");

		const providerConfig = Providers[provider];

		// Get all response transformers of the provider
		let providerTransformers = Providers[provider]?.responseTransforms;
		if (providerConfig.getConfig) {
			providerTransformers =
				providerConfig.getConfig(modelParams).responseTransforms;
		}

		// Extract the relevant response transformer
		if (responseTransformer && streamingMode && response.status === 200) {
			responseTransformerFunction =
				providerTransformers?.[`stream-${responseTransformer}`];
		} else if (responseTransformer) {
			responseTransformerFunction =
				providerTransformers?.[responseTransformer];
		}

		dlog(
			'transforming provider response using',
			responseTransformerFunction
				? `${provider}${responseTransformer}ResponseTransform`
				: 'No transformer found'
		);

		// STREAMING: Convert the stream into OpenAI Stream.
		if (streamingMode && response.status === 200) {
			return handleStreamingMode(
				response,
				provider,
				responseTransformerFunction,
				requestURL
			);
		}
		// NON-STREAMING: Apply the appropriate response transformer to the response.
		return handleNonStreamingMode({
			response,
			responseTransformer: responseTransformerFunction
		});
	} catch (error) {
		// Handle the error here, log it, or throw a new error
		console.error('An error occurred in responseHandler:', error);
		throw error;
	}
}
