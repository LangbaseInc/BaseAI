import {PipeI} from '@baseai/core';
import getCurrentWeatherTool from '../tools/get-current-weather';
import locationObjectTool from '../tools/location-object';
import userObjectTool from '../tools/user-object';

const functionCallingGenerateExamplePipe = (): PipeI => ({
	apiKey: process.env.LANGBASE_USER_ORG_API_KEY!, // Replace with your API key https://langbase.com/docs/api-reference/api-keys
	name: `function-calling-generate-example`,
	description: `LLM function call example generate Pipe`,
	status: `private`,
	model: `openai:gpt-4o-mini`,
	stream: false,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'required',
	parallel_tool_calls: true,
	messages: [
		{role: 'system', content: "You're a helpful AI assistant."},
		{role: 'system', content: '', name: 'json'},
		{role: 'system', content: '', name: 'safety'},
		{
			role: 'system',
			content: 'Welcome to Langbase. Prompt away!',
			name: 'opening',
		},
		{role: 'system', content: '', name: 'rag'},
	],
	variables: [],
	tools: [userObjectTool(), locationObjectTool(), getCurrentWeatherTool()],
	memory: [],
});

export default functionCallingGenerateExamplePipe;
