export type Models =
	| 'Audio models'
	| 'Embedding models'
	| 'Fine-tuning models'
	| 'GPT-4'
	| 'GPT-4 Turbo'
	| 'GPT-3.5 Turbo'
	| 'InstructGPT'
	| 'Base models'
	| 'Image models';

export type GPT4Model =
	| 'gpt-4'
	| 'gpt-4-0314'
	| 'gpt-4-0613'
	| 'gpt-4-32k'
	| 'gpt-4-32k-0314'
	| 'gpt-4-1106-preview'
	| 'gpt-4-1106-vision-preview';

export type GPT3Model =
	| 'gpt-3.5-turbo'
	| 'gpt-3.5-turbo-0301'
	| 'gpt-3.5-turbo-0613'
	| 'gpt-3.5-turbo-16k-0613'
	| 'gpt-3.5-turbo-1106';

export type ChatCompletionModel = GPT3Model | GPT4Model;

export type CompletionModel =
	| 'text-ada-001'
	| 'text-babbage-001'
	| 'text-curie-001'
	| 'text-davinci-002'
	| 'text-davinci-003'
	| 'text-davinci:003';

export type EditModel = 'text-davinci-edit-001' | 'code-davinci-edit-001';

export type FineTunedModel =
	| 'text-davinci-003'
	| 'text-davinci-002'
	| 'text-curie-001'
	| 'text-babbage-001'
	| 'text-ada-001';

export type AudioModel = 'whisper-1' | 'whisper-2';

export type EmbeddingModel =
	| 'text-embedding-ada-002'
	| 'text-embedding-ada-002-v2'
	| 'text-search-ada-doc-001';

export type ImageResolution = '256x256' | '512x512' | '1024x1024';

export type Snapshot =
	| ChatCompletionModel
	| CompletionModel
	| EditModel
	| FineTunedModel
	| AudioModel
	| EmbeddingModel
	| ImageResolution;

export type CompletionModelCost = {
	prompt: number;
	completion: number;
};

export type CostPerUnit = {
	[key in Snapshot | string]?: CompletionModelCost | number;
};

export const IMAGE_MODEL_COST = {
	'1024x1024': 0.02, // per 1 image
	'512x512': 0.018, // per 1 image
	'256x256': 0.016, // per 1 image
};

export const OPEN_AI: string = 'OpenAI';
export const ANTHROPIC: string = 'Anthropic';
export const TOGETHER_AI: string = 'Together';
export const GOOGLE: string = 'Google';
export const GROQ: string = 'Groq';
export const COHERE: string = 'Cohere';
export const FIREWORKS_AI: string = 'Fireworks AI';
export const PERPLEXITY: string = 'Perplexity';

// Not being used yet
export const DEEPINFRA: string = 'deepinfra';
export const BEDROCK: string = 'bedrock';
export const AZURE_OPEN_AI: string = 'azure-openai';

interface Model {
	id: string;
	provider: string;
	promptCost: number;
	completionCost: number;
	requestCost?: number;
}

interface ModelsByProviderInclCosts {
	[provider: string]: Model[];
}

export const modelsByProvider: ModelsByProviderInclCosts = {
	[OPEN_AI]: [
		{
			id: 'gpt-4o',
			provider: OPEN_AI,
			promptCost: 5.0,
			completionCost: 15.0,
		},
		{
			id: 'gpt-4o-2024-08-06',
			provider: OPEN_AI,
			promptCost: 2.5,
			completionCost: 10.0,
		},
		{
			id: 'gpt-4o-mini',
			provider: OPEN_AI,
			promptCost: 0.15,
			completionCost: 0.6,
		},
		{
			id: 'gpt-4-turbo',
			provider: OPEN_AI,
			promptCost: 10.0,
			completionCost: 30.0,
		},
		{
			id: 'gpt-4-turbo-preview',
			provider: OPEN_AI,
			promptCost: 10.0,
			completionCost: 30.0,
		},
		{
			id: 'gpt-4-0125-preview',
			provider: OPEN_AI,
			promptCost: 10.0,
			completionCost: 30.0,
		},
		{
			id: 'gpt-4-1106-preview',
			provider: OPEN_AI,
			promptCost: 10.0,
			completionCost: 30.0,
		},
		{
			id: 'gpt-4',
			provider: OPEN_AI,
			promptCost: 30.0,
			completionCost: 60.0,
		},
		{
			id: 'gpt-4-0613',
			provider: OPEN_AI,
			promptCost: 30.0,
			completionCost: 60.0,
		},
		{
			id: 'gpt-4-32k',
			provider: OPEN_AI,
			promptCost: 60.0,
			completionCost: 120.0,
		},
		{
			id: 'gpt-3.5-turbo',
			provider: OPEN_AI,
			promptCost: 0.5,
			completionCost: 1.5,
		},
		{
			id: 'gpt-3.5-turbo-0125',
			provider: OPEN_AI,
			promptCost: 0.5,
			completionCost: 1.5,
		},
		{
			id: 'gpt-3.5-turbo-1106',
			provider: OPEN_AI,
			promptCost: 1.0,
			completionCost: 2.0,
		},
		{
			id: 'gpt-3.5-turbo-16k',
			provider: OPEN_AI,
			promptCost: 3.0,
			completionCost: 4.0,
		},
	],
	[TOGETHER_AI]: [
		{
			id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
			provider: TOGETHER_AI,
			promptCost: 5,
			completionCost: 5,
		},
		{
			id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
			provider: TOGETHER_AI,
			promptCost: 0.88,
			completionCost: 0.88,
		},
		{
			id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
			provider: TOGETHER_AI,
			promptCost: 0.18,
			completionCost: 0.18,
		},
		{
			id: 'meta-llama/Llama-3-70b-chat-hf',
			provider: TOGETHER_AI,
			promptCost: 0.9,
			completionCost: 0.9,
		},
		{
			id: 'meta-llama/Llama-3-8b-chat-hf',
			provider: TOGETHER_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'togethercomputer/Llama-2-7B-32K-Instruct',
			provider: TOGETHER_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'meta-llama/Llama-2-13b-chat-hf',
			provider: TOGETHER_AI,
			promptCost: 0.225,
			completionCost: 0.225,
		},
		{
			id: 'meta-llama/Llama-2-70b-chat-hf',
			provider: TOGETHER_AI,
			promptCost: 0.9,
			completionCost: 0.9,
		},
		{
			id: 'google/gemma-7b-it',
			provider: TOGETHER_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'google/gemma-2b-it',
			provider: TOGETHER_AI,
			promptCost: 0.1,
			completionCost: 0.1,
		},
		{
			id: 'mistralai/Mistral-7B-Instruct-v0.1',
			provider: TOGETHER_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'mistralai/Mistral-7B-Instruct-v0.2',
			provider: TOGETHER_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
			provider: TOGETHER_AI,
			promptCost: 0.6,
			completionCost: 0.6,
		},
		{
			id: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
			provider: TOGETHER_AI,
			promptCost: 1.2,
			completionCost: 1.2,
		},
		{
			id: 'databricks/dbrx-instruct',
			provider: TOGETHER_AI,
			promptCost: 1.2,
			completionCost: 1.2,
		},
	],
	[ANTHROPIC]: [
		{
			id: 'claude-3-5-sonnet-20240620',
			provider: ANTHROPIC,
			promptCost: 3,
			completionCost: 15,
		},
		{
			id: 'claude-3-opus-20240229',
			provider: ANTHROPIC,
			promptCost: 15,
			completionCost: 75,
		},
		{
			id: 'claude-3-sonnet-20240229',
			provider: ANTHROPIC,
			promptCost: 3,
			completionCost: 15,
		},
		{
			id: 'claude-3-haiku-20240307',
			provider: ANTHROPIC,
			promptCost: 0.25,
			completionCost: 1.25,
		},
	],
	[GROQ]: [
		{
			id: 'llama-3.1-70b-versatile',
			provider: GROQ,
			promptCost: 0.59,
			completionCost: 0.79,
		},
		{
			id: 'llama-3.1-8b-instant',
			provider: GROQ,
			promptCost: 0.59,
			completionCost: 0.79,
		},
		{
			id: 'llama3-70b-8192',
			provider: GROQ,
			promptCost: 0.59,
			completionCost: 0.79,
		},
		{
			id: 'llama3-8b-8192',
			provider: GROQ,
			promptCost: 0.05,
			completionCost: 0.1,
		},
		{
			id: 'mixtral-8x7b-32768',
			provider: GROQ,
			promptCost: 0.27,
			completionCost: 0.27,
		},
		{
			id: 'gemma2-9b-it',
			provider: GROQ,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'gemma-7b-it',
			provider: GROQ,
			promptCost: 0.07,
			completionCost: 0.07,
		},
	],
	[GOOGLE]: [
		{
			id: 'gemini-1.5-pro-latest',
			provider: GOOGLE,
			promptCost: 3.5,
			completionCost: 10.5,
		},
		{
			id: 'gemini-1.5-flash-latest',
			provider: GOOGLE,
			promptCost: 0.075,
			completionCost: 0.3,
		},
		{
			id: 'gemini-pro',
			provider: GOOGLE,
			promptCost: 0.5,
			completionCost: 1.5,
		},
	],
	[COHERE]: [
		{
			id: 'command-r',
			provider: COHERE,
			promptCost: 0.5,
			completionCost: 1.5,
		},
		{
			id: 'command-r-plus',
			provider: COHERE,
			promptCost: 3,
			completionCost: 15,
		},
	],
	[FIREWORKS_AI]: [
		{
			id: 'llama-v3p1-405b-instruct',
			provider: FIREWORKS_AI,
			promptCost: 3,
			completionCost: 3,
		},
		{
			id: 'llama-v3p1-70b-instruct',
			provider: FIREWORKS_AI,
			promptCost: 0.9,
			completionCost: 0.9,
		},
		{
			id: 'llama-v3p1-8b-instruct',
			provider: FIREWORKS_AI,
			promptCost: 0.2,
			completionCost: 0.2,
		},
		{
			id: 'yi-large',
			provider: FIREWORKS_AI,
			promptCost: 3,
			completionCost: 3,
		},
		{
			id: 'llama-v3-70b-instruct',
			provider: FIREWORKS_AI,
			promptCost: 0.9,
			completionCost: 0.9,
		},
	],
	[PERPLEXITY]: [
		{
			id: 'llama-3.1-sonar-huge-128k-online',
			provider: PERPLEXITY,
			promptCost: 5,
			completionCost: 5,
			requestCost: 0.005,
		},
		{
			id: 'llama-3.1-sonar-large-128k-online',
			provider: PERPLEXITY,
			promptCost: 1,
			completionCost: 1,
			requestCost: 0.005,
		},
		{
			id: 'llama-3.1-sonar-small-128k-online',
			provider: PERPLEXITY,
			promptCost: 0.2,
			completionCost: 0.2,
			requestCost: 0.005,
		},
		{
			id: 'llama-3.1-sonar-large-128k-chat',
			provider: PERPLEXITY,
			promptCost: 1,
			completionCost: 1,
		},
		{
			id: 'llama-3.1-sonar-small-128k-chat',
			provider: PERPLEXITY,
			promptCost: 0.2,
			completionCost: 0.2,
		},
	],
};

// Keep it synced with API. Add model IDs.
export const jsonModeModels = [
	'gpt-4o',
	'gpt-4o-2024-08-06',
	'gpt-4o-mini',
	'gpt-4-turbo',
	'gpt-4-turbo-preview',
	'gpt-4-0125-preview',
	'gpt-3.5-turbo',
	'gpt-3.5-turbo-0125',
	'gpt-3.5-turbo-1106',
	'gpt-4-1106-preview',
	'mistralai/Mistral-7B-Instruct-v0.1',
	'mistralai/Mixtral-8x7B-Instruct-v0.1',
	'gemini-1.5-pro-latest',
	'gemini-1.5-flash-latest',
];
