import type { ProviderConfigs } from 'types/providers';
import GroqAPIConfig from './api';
import { GroqChatCompleteConfig } from './chatComplete';

const GroqConfig: ProviderConfigs = {
	chatComplete: GroqChatCompleteConfig,
	api: GroqAPIConfig
};

export default GroqConfig;
