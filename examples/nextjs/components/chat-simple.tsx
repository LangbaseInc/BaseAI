'use client';
import {Input} from '@/components/ui/input';
import {usePipe} from '@baseai/core/react';

const ChatSimple = () => {
	const {messages, input, handleInputChange, handleSubmit, isLoading, error} =
		usePipe({
			apiRoute: '/api/langbase/pipes/run-stream',
		});

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{messages.map((m, i) => (
				<div key={i} className="whitespace-pre-wrap">
					{m.role === 'user' ? 'User: ' : 'AI: '}
					{m.content}
				</div>
			))}
			<form onSubmit={handleSubmit} className="bg-black flex w-full">
				<Input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl "
					value={input}
					placeholder="Say something..."
					onChange={handleInputChange}
					autoFocus
				/>
			</form>
			{isLoading && <div>AI is thinking...</div>}
			{error && (
				<div className="text-red-500">Error: {error.message}</div>
			)}
		</div>
	);
};

export default ChatSimple;
