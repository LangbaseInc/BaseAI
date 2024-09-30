import {Button} from './ui/button';
import {Input} from './ui/input';
import {useState} from 'react';

export default function PipeRunExample() {
	const [prompt, setPrompt] = useState('Who are you?');
	const [completion, setCompletion] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setLoading(true);
		try {
			const response = await fetch('/api/langbase/pipes/run', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				// Send prompt as an LLM message.
				body: JSON.stringify({
					messages: [{role: 'user', content: prompt}],
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// Parse the JSON response.
			const data = await response.json();
			setCompletion(data.completion);
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
					<strong>Generated completion:</strong> {completion}
				</p>
			)}
		</div>
	);
}
