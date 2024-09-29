import type { ProviderConfigs } from 'types/providers';
import OllamaAPIConfig from './api';
import {
	OllamaChatCompleteConfig,
	OllamaChatCompleteResponseTransform,
	OllamaChatCompleteStreamChunkTransform
} from './chatComplete';

const OllamaConfig: ProviderConfigs = {
	api: OllamaAPIConfig,
	chatComplete: OllamaChatCompleteConfig,
	responseTransforms: {
		chatComplete: OllamaChatCompleteResponseTransform,
		'stream-chatComplete': OllamaChatCompleteStreamChunkTransform
	}
};

export default OllamaConfig;
