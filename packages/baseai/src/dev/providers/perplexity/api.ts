import type { ProviderAPIConfig } from 'types/providers';
const PerplexityAIApiConfig: ProviderAPIConfig = {
	baseURL: 'https://api.perplexity.ai',
	headers: (llmApiKey: string) => {
		return {
			Authorization: `Bearer ${llmApiKey}`,
			'content-type': 'application/json',
			accept: 'application/json'
		};
	},
	chatComplete: '/chat/completions'
};

export default PerplexityAIApiConfig;
