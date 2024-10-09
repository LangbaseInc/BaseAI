// Define the specific log categories as a type
export type LogCategories =
	| 'pipe'
	| 'pipe.completion'
	| 'pipe.request'
	| 'pipe.response'
	| 'tool'
	| 'tool.calls'
	| 'memory'
	| 'memory.similarChunks'
	| 'memory.augmentedContext';

// Define a recursive type for nested categories
type NestedCategories = {
	[key in LogCategories]?: boolean | NestedCategories;
};

// Logger config
export type LoggerConfig = {
	isEnabled: boolean;
	logSensitiveData: boolean;
} & NestedCategories;

export interface MemoryConfig {
	useLocalEmbeddings: boolean;
}

export interface BaseAIConfig {
	log: LoggerConfig;
	memory: MemoryConfig;
	envFilePath: string;
	env?: {
		NODE_ENV?: string;
		LANGBASE_API_KEY?: string;
		OPENAI_API_KEY?: string;
		ANTHROPIC_API_KEY?: string;
		COHERE_API_KEY?: string;
		FIREWORKS_API_KEY?: string;
		GOOGLE_API_KEY?: string;
		GROQ_API_KEY?: string;
		MISTRAL_API_KEY?: string;
		PERPLEXITY_API_KEY?: string;
		TOGETHER_API_KEY?: string;
	};
}
