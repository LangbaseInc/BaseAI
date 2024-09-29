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

export interface BaseAIConfig {
	log: LoggerConfig;
	memory: {
		useLocalEmbeddings: boolean;
	};
	// Other configuration options can be added here
}
