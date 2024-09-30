import {mapMetaEnvToProcessEnv} from './../../../../lib/utils';
import getPipeSummary from '../../../../../baseai/pipes/summary';
import {Pipe} from '@baseai/core';
import type {APIRoute} from 'astro';

export const POST: APIRoute = async ({request}) => {
	const runOptions = await request.json();

	// 1. Initiate the Pipe.
	const pipe = new Pipe(getPipeSummary());

	// 2. Run the pipe
	const result = await pipe.run(runOptions);

	// 3. Return the response stringified.
	return new Response(JSON.stringify(result));
};
