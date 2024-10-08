import 'dotenv/config';
import {getRunner, Pipe} from '@baseai/core';
import chatWithRepo from '../baseai/pipes/chat-with-repo';

const pipe = new Pipe(chatWithRepo());

async function main() {
	const {stream, threadId, rawResponse} = await pipe.run({
		messages: [
			{
				role: 'user',
				content: 'Generate example of chat with docs using pipe',
			},
		],
		stream: true,
	});

	// Convert the stream to a stream runner.
	const runner = getRunner(stream);

	// Method 1: Using event listeners
	runner.on('connect', () => {
		console.log('Stream started.\n');
	});

	runner.on('content', content => {
		process.stdout.write(content);
	});

	runner.on('end', () => {
		console.log('\nStream ended.');
	});

	runner.on('error', error => {
		console.error('Error:', error);
	});
}

main();
