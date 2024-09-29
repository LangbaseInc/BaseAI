import type { ProviderAPIConfig } from 'types/providers';

const AnthropicAPIConfig: ProviderAPIConfig = {
	baseURL: 'https://api.anthropic.com/v1',
	headers: ({
		llmApiKey,
		endpoint
	}: {
		llmApiKey: string;
		endpoint: string;
	}) => {
		const headers: Record<string, string> = {
			'X-API-Key': `${llmApiKey}`,
			'anthropic-version': '2023-06-01'
		};
		if (endpoint === 'chatComplete') {
			headers['anthropic-beta'] = 'messages-2023-12-15';
		}
		return headers;
	},
	chatComplete: '/messages'
};

export default AnthropicAPIConfig;
