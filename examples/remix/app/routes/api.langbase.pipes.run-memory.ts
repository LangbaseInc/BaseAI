import type {ActionFunction} from '@remix-run/node';
import getPipeWithMemory from '~/../baseai/pipes/pipe-with-memory';
import {Pipe} from '@baseai/core';

export const action: ActionFunction = async ({request}) => {
	const runOptions = await request.json();
	console.log('runOptions:', runOptions);

	// 1. Initiate the Pipe.
	const pipe = new Pipe(getPipeWithMemory());

	// 2. Run the pipe with user messages and other run options.
	const {stream} = await pipe.run(runOptions);

	// 3. Return the ReadableStream directly.
	return new Response(stream, {
		status: 200,
	});
};
