import 'dotenv/config';
import {Pipe} from '@baseai/core';
import pipeSummary from '../baseai/pipes/summary';

const pipe = new Pipe(pipeSummary());

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
	console.log('response: ', response);
}

main();
