import type {ActionFunction} from '@remix-run/node';
import getPipeWithTool from '~/../baseai/pipes/pipe-with-tool';
import {Pipe} from '@baseai/core';

export const action: ActionFunction = async ({request}) => {
	const runOptions = await request.json();

	// 1. Initiate the Pipe.
	const pipe = new Pipe(getPipeWithTool());

	// 2. Run the pipe with user messages and other run options.
	const result = await pipe.run(runOptions);

	// 2. Return the response stringified.
	return new Response(JSON.stringify(result));
};
