import pipeSummary from '@/baseai/pipes/summary';
import {Pipe} from '@baseai/core';
import {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
	const runOptions = await req.json();

	// 1. Initiate the Pipe.
	const pipe = new Pipe(pipeSummary());

	// 2. Run the Pipe.
	const {stream, threadId} = await pipe.run(runOptions);

	// 3. Return the ReadableStream directly with the threadId in the headers
	//  to be used on the client side to mainain a single chat thread.
	return new Response(stream, {
		status: 200,
		headers: {
			'lb-thread-id': threadId ?? '',
		},
	});
}
