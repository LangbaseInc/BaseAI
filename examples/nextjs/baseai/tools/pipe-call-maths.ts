import {Pipe} from '@baseai/core';
import getPipeWithTool from '../pipes/pipe-with-tool';

const runPipeWithMaths = async ({prompt}: {prompt: string}) => {
	const pipe = new Pipe(getPipeWithTool());
	const result = await pipe.run({
		messages: [{role: 'user', content: prompt}],
	});

	return result.completion;
};

const toolPipeCallMaths = () => ({
	run: runPipeWithMaths,
	type: 'function',
	function: {
		name: 'runPipeWithMaths',
		description: `Call a pipe that can do maths and tell weather from different tools.`,
		parameters: {
			type: 'object',
			required: ['prompt'],
			properties: {
				prompt: {
					type: 'string',
					description: 'User input to do maths or to get weather.',
				},
			},
		},
	},
});

export default toolPipeCallMaths;
