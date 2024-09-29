import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useState } from 'react';

export default function PipeRunMemory() {
	const [prompt, setPrompt] = useState(
		'Who founded Langbase, when, and why?',
	);
	const [completion, setCompletion] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim() || loading) return;

		setLoading(true);
		setCompletion('');

		try {
			console.log('Prompt:', prompt);
			const response = await fetch('/api/langbase/pipes/run-memory', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [{ role: 'user', content: prompt }],
					stream: true,
				}),
			});

			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() || '';

					for (const line of lines) {
						try {
							const data = JSON.parse(line);
							const content = data.choices[0]?.delta?.content;
							if (content) {
								setCompletion(prev => prev + content);
							}
						} catch (error) {
							console.error('Error parsing JSON:', error);
						}
					}
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-neutral-200 rounded-md p-2 flex flex-col gap-2 w-full">
			<div className="flex flex-col gap-2 w-full">
				<p className="text-muted-foreground text-center">
					Ask a question about your docs.
				</p>
			</div>
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