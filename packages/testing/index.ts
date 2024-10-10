import {Pipe} from '@baseai/core';
import 'dotenv/config';
import {config} from './baseai/baseai.config';
import pipeSummary from './baseai/pipes/summary';

const pipe = new Pipe({
	...pipeSummary(),
	config,
});

async function main() {
	const userMsg = 'Who is an AI Engineer?';

	const response = await pipe.run({
		messages: [
			{
				role: 'user',
				content: userMsg,
			},
		],
	});
}

main();
