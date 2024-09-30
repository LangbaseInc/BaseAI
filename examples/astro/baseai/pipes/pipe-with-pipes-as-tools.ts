import type {PipeI} from '@baseai/core';
import toolPipeCall from '../tools/pipe-call';
import toolPipeCallMaths from '../tools/pipe-call-maths';

const getPipeWithPipesAsTools = (): PipeI => ({
	apiKey: process.env.LANGBASE_API_KEY!,
	name: 'composable-pipe',
	description: 'A pipe that calls other pipes',
	status: 'public',
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
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content: `You are a helpful AI assistant. You are an AI agent pipe that will call summary pipe if user wants a summary. You can also call a pipe that can do maths or tell weather. So you have two tools one to call summary pipe and another to call maths or weather pipe. Call the relevant tool based on user input.`,
		},
	],
	variables: [],
	memory: [],
	tools: [toolPipeCall(), toolPipeCallMaths()],
});

export default getPipeWithPipesAsTools;
