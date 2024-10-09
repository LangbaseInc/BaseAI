import {PipeI} from '@baseai/core';
import {config} from '../baseai.config';

const buildPipe = (): PipeI => ({
	apiKey: config.env.langbase,
	name: 'summary-nodejs',
	description: '',
	status: 'private',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: false,
	messages: [
		{
			role: 'system',
			content: `You are a helpful AI assistant. Make everything less wordy.`,
		},
	],
	variables: [],
	memory: [],
	tools: [],
});

export default buildPipe;
