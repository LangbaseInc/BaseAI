import * as p from '@clack/prompts';
import { heading } from './heading';

export default function debugMode(cli: any) {
	p.intro(
		heading({
			text: 'DEBUG MODE',
			sub: 'logs will be verbose...',
			dim: true
		})
	);
	console.log();

	p.intro(
		heading({
			text: 'cwd',
			dim: true
		})
	);
	console.log(process.cwd());
	console.log();

	p.intro(
		heading({
			text: 'cli.flags',
			dim: true
		})
	);
	console.log(cli.flags);
	console.log();

	p.intro(
		heading({
			text: 'cli.input',
			sub: 'commands',
			dim: true
		})
	);
	console.log(cli.input);
	console.log();
}
