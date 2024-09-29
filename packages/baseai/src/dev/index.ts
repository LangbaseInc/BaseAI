import { heading } from '@/utils/heading';
import * as p from '@clack/prompts';
import { outro } from '@clack/prompts';
import { serve } from '@hono/node-server';
import figures from 'figures';
import { Hono, type Context } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { trimTrailingSlash } from 'hono/trailing-slash';
import color from 'picocolors';
import type { HonoEnv } from './hono/env';
import { handleError } from './hono/errors';
import { customCors } from './middleware/custom-cors';
import { poweredBy } from './middleware/powered-by';
import { preFlight } from './middleware/pre-flight';
import { registerRoot } from './routes/base';
import { registerBetaPipesRun } from './routes/beta/pipes/run';

export async function runBaseServer() {
	const app = new Hono();

	app.use(trimTrailingSlash());
	app.use('*', customCors);
	app.use(prettyJSON());
	app.use(poweredBy());
	app.use(preFlight());
	app.onError((err, c) => {
		return handleError(err, c as unknown as Context<HonoEnv, any, {}>);
	});

	// Routes.
	registerRoot(app);
	registerBetaPipesRun(app);

	const port = 9000;

	try {
		p.intro(heading({ text: 'DEV', sub: 'BaseAI dev server' }));

		const server = serve({
			fetch: app.fetch,
			port
		});

		server.on('error', (e: NodeJS.ErrnoException) => {
			if (e.code === 'EADDRINUSE') {
				p.log.error(
					color.red(`Error: Port ${port} is already in use.`)
				);
				p.log.info(
					`Please close the other application using 9000 port. And try again.`
				);

				process.exit(1);
			} else {
				console.error('Unexpected server error:', e);
				process.exit(1);
			}
		});

		server.on('listening', () => {
			outro(
				`BaseAI server running on: ${color.green(`http://localhost:${port}`)}`
			);
			console.log(
				`When needed you can press ${color.cyan('Ctrl + C')} to shut down.`
			);
		});

		// Add immediate shutdown handler using Clack
		process.on('SIGINT', () => {
			const spinner = p.spinner();
			spinner.start('Shutting down server');

			server.close(() => {
				spinner.stop('Shutting down the server …');
				p.outro(
					`${color.green(figures.tick)} BaseAI server has been gracefully shut down.`
				);
				process.exit(0);
			});
		});
	} catch (error: any) {
		p.outro(`Error: Unable to start server. ${error.message}`);
		process.exit(1);
	}
}
