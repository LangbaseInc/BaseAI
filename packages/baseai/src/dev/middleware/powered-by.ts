import type { MiddlewareHandler } from 'hono';

export const poweredBy = (): MiddlewareHandler => {
	return async function poweredBy(c, next) {
		await next();
		c.res.headers.set('lb-powered-by', 'Langbase');
		c.res.headers.set('powered-by', 'BaseAI');
		c.res.headers.set('env', 'local');
	};
};
