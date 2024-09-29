import type { ProviderAPIConfig } from 'types/providers';
const OpenAIAPIConfig: ProviderAPIConfig = {
	baseURL: 'https://api.openai.com/v1',
	headers: (API_KEY: string) => {
		return { Authorization: `Bearer ${API_KEY}` };
	},
	chatComplete: '/chat/completions'
};

export default OpenAIAPIConfig;
