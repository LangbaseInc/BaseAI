import type { MiddlewareHandler } from 'hono';
import { dlog } from '../utils/dlog';

export const debugBase = (): MiddlewareHandler => {
	return async function debugUrl(c, next) {
		const url = new URL(c.req.url);
		const path = url.pathname;

		dlog('API HIT', {
			url: c.req.url,
			path: path,
			method: c.req.method
		});

		if (c.req.method.toUpperCase() === 'POST') {
			try {
				const req = await c.req.json();
				dlog('REQUEST BODY', req);
			} catch (error) {
				dlog('ERROR PARSING REQUEST BODY', error);
			}
		}

		await next();
	};
};
