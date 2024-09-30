import 'dotenv/config';
import {getRunner, Pipe, streamText} from '@baseai/core';
import chatWithDocs from '../baseai/pipes/chat-with-docs';

const pipe = new Pipe(chatWithDocs());

async function main() {
	const {stream, threadId, rawResponse} = await streamText({
		pipe,
		messages: [{role: 'user', content: 'What is the default model used?'}],
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
