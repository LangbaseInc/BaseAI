import {
	ANTHROPIC,
	COHERE,
	FIREWORKS_AI,
	GOOGLE,
	GROQ,
	MISTRAL_AI,
	OLLAMA,
	OPEN_AI,
	PERPLEXITY,
	TOGETHER_AI,
	X_AI,
} from '../data/models';

type Provider =
	| typeof OPEN_AI
	| typeof ANTHROPIC
	| typeof TOGETHER_AI
	| typeof GOOGLE
	| typeof GROQ
	| typeof COHERE
	| typeof FIREWORKS_AI
	| typeof PERPLEXITY;

/**
 * Retrieves the provider based on the given provider string.
 *
 * @param providerString - The provider string.
 * @returns The corresponding provider object.
 * @throws Error if the provider is unknown.
 */
export function getProvider(providerString: string): Provider {
	const providerMap: {[key: string]: Provider} = {
		openai: OPEN_AI,
		anthropic: ANTHROPIC,
		together: TOGETHER_AI,
		google: GOOGLE,
		groq: GROQ,
		cohere: COHERE,
		fireworks: FIREWORKS_AI,
		perplexity: PERPLEXITY,
		ollama: OLLAMA,
		xai: X_AI,
		mistral: MISTRAL_AI,
	};

	const provider = providerMap[providerString.toLowerCase()];
	if (!provider) {
		throw new Error(`Unknown provider: ${providerString}`);
	}
	return provider;
}
