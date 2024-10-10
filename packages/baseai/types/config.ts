/**
 * Represents the various categories of logs that can be generated within the system.
 *
 * @typedef {LogCategories} LogCategories
 *
 * @property {'pipe'} pipe - General pipe-related logs.
 * @property {'pipe.completion'} pipe.completion - Logs related to the completion of a pipe.
 * @property {'pipe.request'} pipe.request - Logs for pipe requests.
 * @property {'pipe.response'} pipe.response - Logs for pipe responses.
 * @property {'pipe.request.prodOptions'} pipe.request.prodOptions - Logs for production options in pipe requests.
 * @property {'pipe.request.localOptions'} pipe.request.localOptions - Logs for local options in pipe requests.
 * @property {'tool'} tool - General tool-related logs.
 * @property {'tool.calls'} tool.calls - Logs for tool calls.
 * @property {'memory'} memory - General memory-related logs.
 * @property {'memory.similarChunks'} memory.similarChunks - Logs for similar memory chunks.
 * @property {'memory.augmentedContext'} memory.augmentedContext - Logs for augmented memory context.
 */
export type LogCategories =
	| 'pipe'
	| 'pipe.completion'
	| 'pipe.request'
	| 'pipe.response'
	| 'pipe.request.prodOptions'
	| 'pipe.request.localOptions'
	| 'tool'
	| 'tool.calls'
	| 'memory'
	| 'memory.similarChunks'
	| 'memory.augmentedContext';

/**
 * Define a recursive type for nested categories
 *
 * Represents a type for nested categories where each key is a `LogCategories` type.
 * The value can either be a boolean or another nested structure of the same type.
 * This allows for creating a hierarchical structure of categories with optional boolean flags.
 */
type NestedCategories = {
	[key in LogCategories]?: boolean | NestedCategories;
};

/**
 * Configuration settings for the logger.
 *
 * @typedef {LoggerConfig}
 *
 * @property {boolean} isEnabled - Indicates if logging is enabled.
 * @property {boolean} [isEnabledInProd] - Optional flag to enable logging in production.
 * @property {boolean} logSensitiveData - Determines if sensitive data should be logged.
 * @property {NestedCategories} - Inherits properties from NestedCategories.
 */
export type LoggerConfig = {
	isEnabled: boolean;
	isEnabledInProd?: boolean;
	logSensitiveData: boolean;
} & NestedCategories;

/**
 * Configuration interface for memory settings.
 *
 * @interface MemoryConfig
 *
 * @property {boolean} useLocalEmbeddings - Indicates whether to use local embeddings.
 */
export interface MemoryConfig {
	useLocalEmbeddings: boolean;
}

/**
 * Interface representing the environment configuration for the application.
 *
 * @property {string} [NODE_ENV] - The environment in which the application is running (e.g., 'development', 'production').
 * @property {string} [LANGBASE_API_KEY] - API key for Langbase // Replace with your API key https://langbase.com/docs/api-reference/api-keys
 * @property {string} [OPENAI_API_KEY] - API key for OpenAI service.
 * @property {string} [ANTHROPIC_API_KEY] - API key for Anthropic service.
 * @property {string} [COHERE_API_KEY] - API key for Cohere service.
 * @property {string} [FIREWORKS_API_KEY] - API key for Fireworks service.
 * @property {string} [GOOGLE_API_KEY] - API key for Google services.
 * @property {string} [GROQ_API_KEY] - API key for GROQ service.
 * @property {string} [MISTRAL_API_KEY] - API key for Mistral service.
 * @property {string} [PERPLEXITY_API_KEY] - API key for Perplexity service.
 * @property {string} [TOGETHER_API_KEY] - API key for Together service.
 */
export interface EnvConfig {
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
}

/**
 * Configuration interface for BaseAI.
 *
 * @interface BaseAIConfig
 *
 * @property {Object} log - Logging configuration.
 * @property {boolean} log.isEnabled - Enable or disable logging.
 * @property {boolean} log.isEnabledInProd - Enable logging in production when NODE_ENV is set to production.
 * @property {boolean} log.logSensitiveData - Enable or disable logging of sensitive data.
 * @property {boolean} log.pipe - Enable or disable logging for pipe operations.
 * @property {boolean} log['pipe.completion'] - Enable or disable logging for pipe completion.
 * @property {boolean} log['pipe.request'] - Enable or disable logging for pipe requests.
 * @property {boolean} log['pipe.response'] - Enable or disable logging for pipe responses.
 * @property {boolean} log.tool - Enable or disable logging for tool operations.
 * @property {boolean} log.memory - Enable or disable logging for memory operations.
 * @property {Object} memory - Memory configuration.
 * @property {boolean} memory.useLocalEmbeddings - Use local embeddings for memory operations.
 * @property {string} envFilePath - Path to the .env file starting from the root of the project.
 * @property {EnvConfig} env - Environment configuration.
 */
export interface BaseAIConfig {
	log: LoggerConfig;
	memory: MemoryConfig;
	envFilePath: string;
	env?: EnvConfig;
}
