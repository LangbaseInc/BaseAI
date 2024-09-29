import {MiddlewareHandler} from 'hono';

export const allowOnlyPost = (): MiddlewareHandler => {
	return async function allowOnlyPost(c, next) {
		if (c.req.method !== 'POST') {
			return c.json({message: 'Bad Request - Only POST requests allowed.'}, 400);
		}
		await next();
	};
};
