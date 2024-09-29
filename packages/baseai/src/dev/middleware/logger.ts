import type { MiddlewareHandler } from 'hono';

export const logger = (): MiddlewareHandler => {
	return async function logger(c, next) {
		await next();
		c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
			const name =
				handler.name ||
				(handler.length < 2 ? '[handler]' : '[middleware]');
			console.log(
				method,
				' ',
				path,
				' '.repeat(Math.max(10 - path.length, 0)),
				name,
				i === c.req.routeIndex ? '<- respond from here' : ''
			);
		});
	};
};
