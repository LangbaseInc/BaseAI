import type { ProviderConfigs } from 'types/providers';
import OpenAIAPIConfig from './api';
import { OpenAIChatCompleteConfig } from './chatComplete';

const OpenAIConfig: ProviderConfigs = {
	api: OpenAIAPIConfig,
	chatComplete: OpenAIChatCompleteConfig
};

export default OpenAIConfig;
