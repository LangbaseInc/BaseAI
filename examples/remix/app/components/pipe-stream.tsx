import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useState } from 'react';
import { getRunner } from '@baseai/core';

export default function PipeStreamExample() {
	const [prompt, setPrompt] = useState('Who are you?');
	const [completion, setCompletion] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim() || loading) return;

		setLoading(true);
		setCompletion('');

		try {
			const response = await fetch('/api/langbase/pipes/run-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// Send prompt as an LLM message.
				body: JSON.stringify({
					messages: [{ role: 'user', content: prompt }],
					stream: true,
				}),
			});

			if (response.body) {
				// Convert the stream to a stream runner.
				const runner = getRunner(response.body);

				// Method 1: Using event listeners
				runner.on('connect', () => {
					console.log('Stream started.\n');
				});

				runner.on('content', content => {
					setCompletion(prev => prev + content);
				});

				runner.on('end', () => {
					console.log('\nStream ended.');
				});

				runner.on('error', error => {
					console.error('Error:', error);
				});

				console.dir(await runner.finalChatCompletion(), { depth: null });

				// Method #2 to get all of the chunk.
				// for await (const chunk of runner) {
				// 	const content = chunk?.choices[0]?.delta?.content;
				// 	content && setCompletion(prev => prev + content);
				// }
			}
		} catch (error) {
			setLoading(false);
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-neutral-200 rounded-md p-2 flex flex-col gap-2 w-full">
			<form
				onSubmit={handleSubmit}
				className="flex flex-col w-full items-center gap-2"
			>
				<Input
					type="text"
					placeholder="Enter prompt message here"
					onChange={e => setPrompt(e.target.value)}
					value={prompt}
					required
				/>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? 'AI is thinking...' : 'Ask AI'}
				</Button>
			</form>
			{completion && (
				<p className="mt-4">
					<strong>Stream:</strong> {completion}
				</p>
			)}
		</div>
	);
}
