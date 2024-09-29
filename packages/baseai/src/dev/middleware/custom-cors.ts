import type { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';

// Custom CORS middleware configuration
export const customCors: MiddlewareHandler = cors({
	origin: '*', // Equivalent to 'Access-Control-Allow-Origin'
	maxAge: 86400, // Equivalent to 'Access-Control-Max-Age'
	allowMethods: ['GET', 'POST', 'OPTIONS'], // Equivalent to 'Access-Control-Allow-Methods'
	allowHeaders: ['Content-Type', 'Authorization'] // Equivalent to 'Access-Control-Allow-Headers'
});
