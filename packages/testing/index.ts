import 'dotenv/config';
import {generateText, Pipe, streamText} from '../core/src/index';
import {getRunner} from '../core/src/lib/browser/stream';
import pipeSummary from './baseai/pipes/summary';

const pipe = new Pipe({
	apiKey: process.env.LANGBASE_SDK_GENERATE_PIPE!,
	...pipeSummary(),
});

(async () => {
	{
		// const userMsg = 'Say test.';
		const userMsg = 'Who is Ahmad Awais?';

		// Run.
		// const response = await pipe.run({
		// 	rawResponse: true,
		// 	messages: [
		// 		{
		// 			role: 'user',
		// 			content: userMsg,
		// 		},
		// 	],
		// });
		// console.log('response: ', response);

		// Run Stream
		const {stream} = await pipe.run({
			messages: [{role: 'user', content: userMsg}],
			stream: true,
			rawResponse: true,
		});

		const runner = getRunner(stream);

		// runner.on('connect', () => {
		// 	console.log('Stream started.');
		// });

		// runner.on('error', error => {
		// 	console.error('Error:', error);
		// });

		// runner.on('content', content => {
		// 	process.stdout.write(content);
		// });

		// runner.on('end', () => {
		// 	console.log('Stream ended.');
		// });

		// Using utility functions
		const genResult = await generateText({
			pipe,
			messages: [{role: 'user', content: userMsg}],
		});
		console.log('genResult: ', genResult);

		const streamResult = await streamText({
			pipe,
			messages: [{role: 'user', content: userMsg}],
		});
	}
})();
