import {PipeI} from '@baseai/core';

const pipeSummary = (): PipeI => ({
	apiKey: process.env.LANGBASE_API_KEY!,
	name: 'summary',
	description: 'AI Summary agent',
	status: 'private',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 100,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: false,
	messages: [
		{
			role: 'system',
			content: `You are a helpful AI assistant. Make everything Less wordy.`,
		},
	],
	variables: [],
	tools: [],
	memory: [],
});

export default pipeSummary;
