import type { ProviderConfigs } from 'types/providers';
import FireworksAIAPIConfig from './api';
import {
	FireworksAIChatCompleteConfig,
	FireworksAIChatCompleteResponseTransform,
	FireworksAIChatCompleteStreamChunkTransform
} from './chatComplete';

const FireworksAIConfig: ProviderConfigs = {
	chatComplete: FireworksAIChatCompleteConfig,
	api: FireworksAIAPIConfig,
	responseTransforms: {
		chatComplete: FireworksAIChatCompleteResponseTransform,
		'stream-chatComplete': FireworksAIChatCompleteStreamChunkTransform
	}
};

export default FireworksAIConfig;
