import type { ProviderAPIConfig } from 'types/providers';
const FireworksAIAPIConfig: ProviderAPIConfig = {
	baseURL: 'https://api.fireworks.ai/inference/v1',
	headers: ({ llmApiKey }: { llmApiKey: string }) => {
		return {
			Authorization: `Bearer ${llmApiKey}`,
			Accept: 'application/json'
		};
	},
	getEndpoint: ({ endpoint }: { endpoint: string }) => {
		switch (endpoint) {
			case 'chatComplete':
				return '/chat/completions';
			default:
				return '';
		}
	}
};

export default FireworksAIAPIConfig;
