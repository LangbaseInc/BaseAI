import { handleProviderResponse } from './provider-response-handler';
import Providers from '@/dev/providers';
import { constructRequest } from './construct-provider-request';
import { ANTHROPIC, FIREWORKS_AI, GOOGLE, OLLAMA } from '@/dev/data/models';
import { ApiError } from '@/dev/hono/errors';
import { dlog } from '../dlog';
import type {
	endpointStrings,
	ModelParams,
	ProviderAPIConfig,
	ProviderOptions
} from 'types/providers';

/**
 * Makes a POST request to a provider and returns the response.
 * The POST request is constructed using the provider, llmApiKey, and inputParams parameters.
 * The endpoint parameter is the type of request being made (e.g., "complete", "chatComplete").
 * Currently only handles non-streamed responses. We handle streaming with provider sdks.
 *
 * @param {ProviderOptions} providerOptions - The provider options.
 * @param {inputParams} inputParams - The langbase model params.
 * @param {string} endpoint - The endpoint of the provider, eg chatComplete, embed, etc.
 * @param {transformedRequestParams} transformedRequestParams - The transformed params in the provider's format.
 * @returns {Promise<any>} - The response from the POST request.
 * @throws Will throw an error if the response is not ok or if all retry attempts fail.
 */
export async function handleProviderRequest({
	providerOptions,
	inputParams,
	endpoint,
	transformedRequestParams
}: {
	providerOptions: ProviderOptions;
	inputParams: ModelParams;
	endpoint: endpointStrings;
	transformedRequestParams: { [key: string]: any };
}): Promise<any> {
	const params: ModelParams = { ...inputParams };

	const isStreamingMode = params.stream ? true : false;

	const provider: string = providerOptions.provider ?? '';
	// Get API request info for the provider
	const apiConfig: ProviderAPIConfig = Providers[provider].api;

	let baseUrl: string = '',
		providerEndpoint: string,
		fetchOptions;

	/**
	 * Handling providers with different base URLs and endpoints.
	 * Maps to following functions in providers/provider/api.ts
	 * headers()
	 * getEndpoint()
	 */

	// Anthropic
	if (provider === ANTHROPIC && apiConfig.baseURL) {
		const providerConfigMappedHeaders = apiConfig.headers({
			llmApiKey: providerOptions.llmApiKey,
			endpoint
		});

		fetchOptions = constructRequest({
			providerConfigMappedHeaders,
			method: 'POST'
		});
		baseUrl = baseUrl || apiConfig.baseURL;
		providerEndpoint = apiConfig[endpoint] || '';
	}
	// Google
	else if (
		provider === GOOGLE &&
		apiConfig.baseURL &&
		apiConfig.getEndpoint
	) {
		fetchOptions = constructRequest({
			providerConfigMappedHeaders: apiConfig.headers(),
			method: 'POST'
		});
		baseUrl = baseUrl || apiConfig.baseURL;
		providerEndpoint = apiConfig.getEndpoint({
			endpoint,
			llmApiKey: providerOptions.llmApiKey,
			model: transformedRequestParams.model,
			stream: params.stream
		});
	}
	// Fireworks AI
	else if (
		provider === FIREWORKS_AI &&
		apiConfig.baseURL &&
		apiConfig.getEndpoint
	) {
		fetchOptions = constructRequest({
			providerConfigMappedHeaders: apiConfig.headers({
				llmApiKey: providerOptions.llmApiKey
			}),
			method: 'POST'
		});
		baseUrl = baseUrl || apiConfig.baseURL;
		providerEndpoint = apiConfig.getEndpoint({ endpoint });
	}
	// Ollama
	else if (provider === OLLAMA && apiConfig.getBaseURL) {
		fetchOptions = constructRequest({
			providerConfigMappedHeaders: apiConfig.headers(),
			method: 'POST'
		});
		baseUrl = apiConfig.getBaseURL({ providerOptions });
		providerEndpoint = apiConfig[endpoint] || '';

		dlog('Ollama request', {
			baseUrl,
			providerEndpoint,
			transformedRequestParams
		});
	}
	// Other providers
	else {
		fetchOptions = constructRequest({
			providerConfigMappedHeaders: apiConfig.headers(
				providerOptions.llmApiKey
			),
			method: 'POST'
		});

		// We can support custom base urls and endpoints here
		baseUrl = baseUrl || apiConfig.baseURL || '';
		providerEndpoint = apiConfig[endpoint] || '';
	}

	// Construct the request URL and body
	const url = `${baseUrl}${providerEndpoint}`;
	fetchOptions.body = JSON.stringify(transformedRequestParams);

	let response;

	try {
		response = (await fetch(url, fetchOptions)) as unknown as Response & {
			webSocket?: any;
			cf?: any;
		};

		// Transform provider's response into OpenAI format
		const transformedResponse = await handleProviderResponse({
			response,
			streamingMode: isStreamingMode,
			provider,
			responseTransformer: endpoint,
			requestURL: url,
			modelParams: params
		});

		dlog('Transformed provider response', transformedResponse);

		// Handle LLM errors.
		if (!response.ok) {
			throw transformedResponse.error;
		}

		return transformedResponse;
	} catch (error: any) {
		console.error(error);
		throw new ApiError({
			code: 'INTERNAL_SERVER_ERROR',
			message: error.message
		});
	}
}
