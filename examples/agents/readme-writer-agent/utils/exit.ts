import pc from 'picocolors';
import figures from 'figures';
import * as p from '@clack/prompts';
import {heading} from './heading';

export async function exit({path}: {path: string}) {
	p.outro(
		heading({
			text: 'readme.md',
			sub: `instructions written in \n ${pc.dim(figures.pointer)} ${pc.italic(pc.dim(path))}`,
			green: true,
		}),
	);
	process.exit(0);
}
