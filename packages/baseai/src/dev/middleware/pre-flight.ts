import {MiddlewareHandler} from 'hono';

export const preFlight = (): MiddlewareHandler => {
	return async function preFlight(c, next) {
		if (c.req.method === 'OPTIONS') {
			return new Response(null);
		}
		await next();
	};
};
