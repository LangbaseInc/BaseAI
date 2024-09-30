import {PipeI} from '@baseai/core';

const buildPipe = (): PipeI => ({
	apiKey: process.env.LANGBASE_API_KEY!, // Replace with your API key https://langbase.com/docs/api-reference/api-keys
	name: 'summary',
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
	messages: [{role: 'system', content: `You are a helpful AI assistant.`}],
	variables: [],
	memory: [],
	tools: [],
});

export default buildPipe;
