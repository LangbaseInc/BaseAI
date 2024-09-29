import {PipeI} from '@baseai/core';

const getPipeTinyLlama = (): PipeI => ({
	apiKey: process.env.LANGBASE_USER_API_KEY, // Replace with your API key https://langbase.com/docs/api-reference/api-keys
	name: 'local-llm',
	description: 'A pipe that calls local llm using ollama',
	status: 'public',
	// model: 'ollama:tinyllama',
	model: 'ollama:ben1t0/tiny-llm',
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
			content: `You are a helpful AI assistant. Less wordy.`,
		},
	],
	variables: [],
	memory: [],
	tools: [],
});

export default getPipeTinyLlama;
