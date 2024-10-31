'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRunner, getTextContent } from '@baseai/core';
import { useState } from 'react';

export default function PipeRunToolStreamExample() {
	const [prompt, setPrompt] = useState(
		'What is the weather in SF. Square root of 9 and then add 7?',
	);
	const [completion, setCompletion] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setLoading(true);
		try {
			const response = await fetch('/api/langbase/pipes/run-tool-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [{ role: 'user', content: prompt }],
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const runner = getRunner(response.body as ReadableStream<Uint8Array>);

			let localCompletion = '';
			for await (const chunk of runner) {
				const textPart = getTextContent(chunk);
				localCompletion += textPart;
				setCompletion(localCompletion);
			}
		} catch (error) {
			console.error('Error:', error);
			setCompletion('An error occurred while generating the completion.');
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
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					required
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? 'AI is thinking...' : 'Ask AI'}
				</Button>
			</form>

			{!loading && completion && (
				<p className="mt-4">
					<strong>AI:</strong> {completion}
				</p>
			)}
		</div>
	);
}
