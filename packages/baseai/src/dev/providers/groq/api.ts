import type { ProviderAPIConfig } from 'types/providers';
const GroqAPIConfig: ProviderAPIConfig = {
	baseURL: 'https://api.groq.com/openai/v1',
	headers: (llmApiKey: string) => {
		return { Authorization: `Bearer ${llmApiKey}` };
	},
	chatComplete: '/chat/completions'
};

export default GroqAPIConfig;
