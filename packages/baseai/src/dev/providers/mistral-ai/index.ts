import type { ProviderConfigs } from 'types/providers';
import MistralAIAPIConfig from './api';
import {
	MistralAIChatCompleteConfig,
	MistralAIChatCompleteResponseTransform,
	MistralAIChatCompleteStreamChunkTransform
} from './chatComplete';

const MistralAIConfig: ProviderConfigs = {
	chatComplete: MistralAIChatCompleteConfig,
	api: MistralAIAPIConfig,
	responseTransforms: {
		chatComplete: MistralAIChatCompleteResponseTransform,
		'stream-chatComplete': MistralAIChatCompleteStreamChunkTransform
	}
};

export default MistralAIConfig;
