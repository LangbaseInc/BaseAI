import {Pipe} from '@baseai/core';
import {NextRequest} from 'next/server';
import pipeWithTools from '../../../../../baseai/pipes/pipe-with-tool';

export async function POST(req: NextRequest) {
	const runOptions = await req.json();

	// 1. Initiate the Pipe.
	const pipe = new Pipe(pipeWithTools());

	// 2. Run the pipe with user messages and other run options.
	let result = await pipe.run(runOptions);

	// 2. Return the response stringified.
	return new Response(JSON.stringify(result));
}
