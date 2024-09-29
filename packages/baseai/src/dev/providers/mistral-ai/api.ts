import type { ProviderAPIConfig } from 'types/providers';
const MistralAIAPIConfig: ProviderAPIConfig = {
	baseURL: 'https://api.mistral.ai/v1',
	headers: (llmApiKey: string) => {
		return {
			Authorization: `Bearer ${llmApiKey}`
		};
	},
	chatComplete: '/chat/completions'
};

export default MistralAIAPIConfig;
