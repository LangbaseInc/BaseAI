import {Pipe} from '@baseai/core';
import pipeSummary from '../pipes/summary';

const runSummaryPipe = async ({prompt}: {prompt: string}) => {
	const pipe = new Pipe(pipeSummary());
	const result = await pipe.run({
		messages: [{role: 'user', content: `${prompt} — please max one line`}],
	});

	return result.completion;
};

const toolPipeCall = () => ({
	run: runSummaryPipe,
	type: 'function',
	function: {
		name: 'runSummaryPipe',
		description: `Call a pipe that can summarize text.`,
		parameters: {
			type: 'object',
			required: ['prompt'],
			properties: {
				prompt: {
					type: 'string',
					description: 'User input to summarize',
				},
			},
		},
	},
});

export default toolPipeCall;
