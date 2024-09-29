import type { ProviderAPIConfig } from 'types/providers';
const GoogleApiConfig: ProviderAPIConfig = {
	baseURL: 'https://generativelanguage.googleapis.com/v1beta',
	headers: () => {
		return { 'Content-Type': 'application/json' };
	},
	getEndpoint: ({
		endpoint,
		llmApiKey,
		model,
		stream
	}: {
		endpoint: string;
		llmApiKey: string;
		model: string;
		stream: boolean;
	}) => {
		let mappedEndpoint = endpoint;
		if (stream) {
			mappedEndpoint = `stream-${endpoint}`;
		}
		switch (mappedEndpoint) {
			case 'chatComplete': {
				return `/models/${model}:generateContent?key=${llmApiKey}`;
			}
			case 'stream-chatComplete': {
				return `/models/${model}:streamGenerateContent?key=${llmApiKey}`;
			}
		}
	}
};

export default GoogleApiConfig;
