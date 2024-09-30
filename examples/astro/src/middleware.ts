import type {APIContext, APIRoute} from 'astro';
import {mapMetaEnvToProcessEnv} from './lib/utils';

export function onRequest(
	context: APIContext,
	next: () => ReturnType<APIRoute>,
): ReturnType<APIRoute> {
	// Map the meta environment variables to process environment variables
	mapMetaEnvToProcessEnv();

	// Return a Response or the result of calling `next()`
	return next();
}
