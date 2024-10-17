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

export function getLLMApiKey(modelProvider: string): string {
	switch (true) {
		case modelProvider.includes(OPEN_AI):
			return process.env.OPENAI_API_KEY || '';
		case modelProvider === ANTHROPIC:
			return process.env.ANTHROPIC_API_KEY || '';
		case modelProvider === TOGETHER_AI:
			return process.env.TOGETHER_API_KEY || '';
		case modelProvider === GROQ:
			return process.env.GROQ_API_KEY || '';
		case modelProvider === GOOGLE:
			return process.env.GOOGLE_API_KEY || '';
		case modelProvider.includes(COHERE):
			return process.env.COHERE_API_KEY || '';
		case modelProvider.includes(FIREWORKS_AI):
			return process.env.FIREWORKS_API_KEY || '';
		case modelProvider.includes(PERPLEXITY):
			return process.env.PERPLEXITY_API_KEY || '';
		case modelProvider.includes(OLLAMA):
			return process.env.OLLAMA_API_KEY || '';

		default:
			throw new Error(`Unsupported model provider: ${modelProvider}`);
	}
}
