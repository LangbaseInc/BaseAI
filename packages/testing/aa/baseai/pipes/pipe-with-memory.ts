import {Pipe} from '../../../core/types/pipes';

const getPipeWithMemory = (): Pipe => ({
	apiKey: process.env.LANGBASE_PIPE_LESS_WORDY!,
	name: 'pipe-with-memory',
	description: 'An AI agent pipe that can use memory',
	status: 'public',
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
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content: `You are a helpful AI assistant. Answer only from context or say "I don't know" if you don't know the answer.`,
		},
	],
	variables: [],
	memory: [
		{
			name: 'chat-with-docs',
		},
	],
	tools: [],
});
export default getPipeWithMemory;
