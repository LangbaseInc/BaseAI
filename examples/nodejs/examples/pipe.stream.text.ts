import 'dotenv/config';
import {getRunner, Pipe, streamText} from '@baseai/core';
import pipeSummary from '../baseai/pipes/summary';

const pipe = new Pipe(pipeSummary());

async function main() {
	const {stream, threadId, rawResponse} = await streamText({
		pipe,
		messages: [{role: 'user', content: 'Hello'}],
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
