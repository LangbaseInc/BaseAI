import 'dotenv/config';
import {getRunner, getTextContent, Pipe} from '@baseai/core';
import pipeSummary from '../baseai/pipes/summary';

const pipe = new Pipe(pipeSummary());

async function main() {
	// Get readable stream
	const {stream, threadId, rawResponse} = await pipe.run({
		messages: [{role: 'user', content: 'Who is an AI Engineer?'}],
		stream: true,
		rawResponse: true,
	});

	// Convert the stream to a stream runner.
	const runner = getRunner(stream);

	// Method 2: Using `for await of` loop
	// This will not allow callbacks lkke `connect`, `end`, `error`
	for await (const chunk of runner) {
		// const textPart = chunk.choices[0]?.delta?.content || '';
		// Or use the utility function
		const textPart = getTextContent(chunk);

		// Print to the console without new line
		process.stdout.write(textPart);
	}
}

main();
