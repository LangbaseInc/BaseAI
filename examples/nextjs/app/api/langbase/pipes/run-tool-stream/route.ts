import pipeWithToolsStream from '@/baseai/pipes/pipe-with-tool-stream';
import {Pipe, RunResponseStream} from '@baseai/core';
import {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
	const runOptions = await req.json();

	// 1. Initiate the Pipe.
	const pipe = new Pipe(pipeWithToolsStream());

	// 2. Run the pipe with user messages and other run options.
	let {stream, threadId} = (await pipe.run({
		...runOptions,
		stream: true,
	})) as unknown as RunResponseStream;

	// 3. Stream the response.
	return new Response(stream, {
		status: 200,
		headers: {
			'lb-thread-id': threadId ?? '',
		},
	});
}
