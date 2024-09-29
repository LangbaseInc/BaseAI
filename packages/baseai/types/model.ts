export type OpenAIModels =
	| 'openai:gpt-4o'
	| 'openai:gpt-4o-2024-08-06'
	| 'openai:gpt-4o-mini'
	| 'openai:gpt-4-turbo'
	| 'openai:gpt-4-turbo-preview'
	| 'openai:gpt-4-0125-preview'
	| 'openai:gpt-4-1106-preview'
	| 'openai:gpt-4'
	| 'openai:gpt-4-0613'
	| 'openai:gpt-4-32k'
	| 'openai:gpt-3.5-turbo'
	| 'openai:gpt-3.5-turbo-0125'
	| 'openai:gpt-3.5-turbo-1106'
	| 'openai:gpt-3.5-turbo-16k';

export type TogetherModels =
	| 'together:meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
	| 'together:meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
	| 'together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
	| 'together:meta-llama/Llama-3-70b-chat-hf'
	| 'together:meta-llama/Llama-3-8b-chat-hf'
	| 'together:togethercomputer/Llama-2-7B-32K-Instruct'
	| 'together:meta-llama/Llama-2-13b-chat-hf'
	| 'together:meta-llama/Llama-2-70b-chat-hf'
	| 'together:google/gemma-7b-it'
	| 'together:google/gemma-2b-it'
	| 'together:mistralai/Mistral-7B-Instruct-v0.1'
	| 'together:mistralai/Mistral-7B-Instruct-v0.2'
	| 'together:mistralai/Mixtral-8x7B-Instruct-v0.1'
	| 'together:mistralai/Mixtral-8x22B-Instruct-v0.1'
	| 'together:databricks/dbrx-instruct';

export type AnthropicModels =
	| 'anthropic:claude-3-5-sonnet-20240620'
	| 'anthropic:claude-3-opus-20240229'
	| 'anthropic:claude-3-sonnet-20240229'
	| 'anthropic:claude-3-haiku-20240307';

export type GroqModels =
	| 'groq:llama-3.1-70b-versatile'
	| 'groq:llama-3.1-8b-instant'
	| 'groq:llama3-70b-8192'
	| 'groq:llama3-8b-8192'
	| 'groq:mixtral-8x7b-32768'
	| 'groq:gemma2-9b-it'
	| 'groq:gemma-7b-it';

export type GoogleModels =
	| 'google:gemini-1.5-pro-latest'
	| 'google:gemini-1.5-flash-latest'
	| 'google:gemini-pro';

export type CohereModels = 'cohere:command-r' | 'cohere:command-r-plus';

export type FireworksAIModels =
	| 'fireworks:llama-v3p1-405b-instruct'
	| 'fireworks:llama-v3p1-8b-instruct'
	| 'fireworks:llama-v3p1-70b-instruct'
	| 'fireworks:llama-v3-70b-instruct'
	| 'fireworks:yi-large';

export type PerplexityModels =
	| 'perplexity:llama-3.1-sonar-huge-128k-online'
	| 'perplexity:llama-3.1-sonar-large-128k-online'
	| 'perplexity:llama-3.1-sonar-small-128k-online'
	| 'perplexity:llama-3.1-sonar-large-128k-chat'
	| 'perplexity:llama-3.1-sonar-small-128k-chat';

export type MistralAIModels =
	| 'mistral:mistral-large-latest'
	| 'mistral:open-mistral-nemo'
	| 'mistral:codestral-latest';

export type OllamaModels = `ollama:${string}`;
