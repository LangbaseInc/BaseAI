import {
	ANTHROPIC,
	COHERE,
	FIREWORKS_AI,
	GOOGLE,
	GROQ,
	OLLAMA,
	OPEN_AI,
	PERPLEXITY,
	TOGETHER_AI,
} from '../data/models';

export function getLLMApiKey({
	modelProvider,
	configEnv,
}: {
	modelProvider: string;
	configEnv?: Record<string, string>;
}): string {
	const getEnv = (key: string) => {
		let value;
		if (configEnv && key in configEnv) {
			value = configEnv[key];
		} else {
			value = process.env[key];
		}
		if (!value) {
			throw new Error(
				`Environment variable ${key} is not set or empty. Only needed in local dev environment. \nNote: In production, add it to your keysets https://langbase.com/docs/features/keysets\n`,
			);
		}
		return value;
	};

	switch (true) {
		case modelProvider.includes(OPEN_AI):
			return getEnv('OPENAI_API_KEY');
		case modelProvider === ANTHROPIC:
			return getEnv('ANTHROPIC_API_KEY');
		case modelProvider === TOGETHER_AI:
			return getEnv('TOGETHER_API_KEY');
		case modelProvider === GROQ:
			return getEnv('GROQ_API_KEY');
		case modelProvider === GOOGLE:
			return getEnv('GOOGLE_API_KEY');
		case modelProvider.includes(COHERE):
			return getEnv('COHERE_API_KEY');
		case modelProvider.includes(FIREWORKS_AI):
			return getEnv('FIREWORKS_API_KEY');
		case modelProvider.includes(PERPLEXITY):
			return getEnv('PERPLEXITY_API_KEY');
		case modelProvider.includes(OLLAMA):
			return getEnv('OLLAMA_API_KEY');
		default:
			throw new Error(`Unsupported model provider: ${modelProvider}`);
	}
}
