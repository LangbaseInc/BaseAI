import type { ProviderConfigs } from 'types/providers';
import AnthropicAPIConfig from './api';
import {
	AnthropicChatCompleteConfig,
	AnthropicChatCompleteResponseTransform,
	AnthropicChatCompleteStreamChunkTransform
} from './chatComplete';

const AnthropicConfig: ProviderConfigs = {
	chatComplete: AnthropicChatCompleteConfig,
	api: AnthropicAPIConfig,
	responseTransforms: {
		chatComplete: AnthropicChatCompleteResponseTransform,
		'stream-chatComplete': AnthropicChatCompleteStreamChunkTransform
	}
};

export default AnthropicConfig;
