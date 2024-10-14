'use server'

import {NextRequest} from 'next/server';
import { Pipe } from '@baseai/core';
import { RunOptionsStream } from '@baseai/core';
import pipeAskMyTextDocumentsAgent from '@/baseai/pipes/ask-my-text-documents-agent';

export async function POST(req: NextRequest) {
	const runOptions = await req.json() as RunOptionsStream;;

	// 1. Initiate the Pipe.
	const pipe = new Pipe(pipeAskMyTextDocumentsAgent());

	// 2. Run the Pipe.
	const {stream, threadId} = await pipe.run(runOptions);
	// 3. Return the ReadableStream directly.
	return new Response(stream, {
		status: 200,
		headers: {
			'lb-thread-id': threadId ?? '',
		},
	});
}