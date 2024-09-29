import type { ProviderConfigs } from 'types/providers';
import PerplexityAIApiConfig from './api';
import {
	PerplexityAIChatCompleteConfig,
	PerplexityAIChatCompleteResponseTransform,
	PerplexityAIChatCompleteStreamChunkTransform
} from './chatComplete';

const PerplexityAIConfig: ProviderConfigs = {
	chatComplete: PerplexityAIChatCompleteConfig,
	api: PerplexityAIApiConfig,
	responseTransforms: {
		chatComplete: PerplexityAIChatCompleteResponseTransform,
		'stream-chatComplete': PerplexityAIChatCompleteStreamChunkTransform
	}
};

export default PerplexityAIConfig;
