import {
	ANTHROPIC,
	COHERE,
	FIREWORKS_AI,
	GOOGLE,
	GROQ,
	MISTRAL_AI,
	OLLAMA,
	OPEN_AI,
	PERPLEXITY,
	TOGETHER_AI
} from '../data/models';

import type { ProviderConfigs } from 'types/providers';

import AnthropicConfig from './anthropic';
import OpenAIConfig from './openai';
import TogetherAIConfig from './together-ai';
import GroqConfig from './groq';
import GoogleConfig from './google';
import CohereConfig from './cohere';
import FireworksAIConfig from './fireworks-ai';
import PerplexityAIConfig from './perplexity';
import MistralAIConfig from './mistral-ai';
import OllamaConfig from './ollama';

// Provider Configs
const Providers: { [key: string]: ProviderConfigs } = {
	[OPEN_AI]: OpenAIConfig,
	[ANTHROPIC]: AnthropicConfig,
	[TOGETHER_AI]: TogetherAIConfig,
	[GROQ]: GroqConfig,
	[GOOGLE]: GoogleConfig,
	[COHERE]: CohereConfig,
	[FIREWORKS_AI]: FireworksAIConfig,
	[PERPLEXITY]: PerplexityAIConfig,
	[MISTRAL_AI]: MistralAIConfig,
	[OLLAMA]: OllamaConfig
};

export default Providers;
