import {Button} from './ui/button';
import {Input} from './ui/input';
import React, {useCallback} from 'react';
import {usePipe} from '@baseai/core/react';

const ChatAdvancedExample: React.FC = () => {
	const handleResponse = useCallback(
		(message: {role: string; content: string}) => {
			console.log(
				'Received response:',
				message.content.slice(0, 50) + '...',
			);
		},
		[],
	);

	const handleFinish = useCallback(
		(messages: {role: string; content: string}[]) => {
			console.log(
				`Conversation finished. Total messages: ${messages.length}`,
			);
		},
		[],
	);

	const handleError = useCallback((error: Error) => {
		console.error('An error occurred:', error);
	}, []);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		error,
		regenerate,
		stop,
		setMessages,
		threadId,
		sendMessage,
	} = usePipe({
		stream: true,
		apiRoute: '/api/langbase/pipes/run-stream',
		onResponse: handleResponse,
		onFinish: handleFinish,
		onError: handleError,
		// initialMessages: [
		// 	{role: 'assistant', content: 'Hello! How can I help you?'},
		// 	{role: 'user', content: 'Who is an AI engineer?'},
		// ], // You can set initial messages here if needed
		// You can set a threadId here if needed to change the thread manually,
		// otherwise it will be generated automatically persistented in the browser.
		// threadId: '',
	});

	const handleClearChat = () => {
		setMessages([]);
	};

	const handleRegenerateWithOptions = () => {
		regenerate({
			headers: {'Custom-Header': 'Regenerate'},
			body: {customOption: 'regenerateValue'},
		});
	};

	const handleCustomMessage = () => {
		sendMessage('This is a custom message', {
			data: {context: 'custom context'},
			allowEmptySubmit: false,
		});
	};

	return (
		<div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4 w-full">
			<div className="mb-4">
				<strong>Thread ID:</strong> {threadId || 'Not available'}
			</div>
			<div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-32 w-full">
				{messages.map((m, index) => (
					<div
						key={index}
						className={`p-2 rounded ${
							m.role === 'user' ? 'bg-indigo-200' : 'bg-gray-100'
						}`}
					>
						<strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
						{m.content}
					</div>
				))}
			</div>

			<div className="fixed bottom-0 left-0 right-0 bg-white p-4 max-w-2xl mx-auto">
				{isLoading && (
					<div className="text-center text-gray-500 mb-8">
						AI is thinking...
					</div>
				)}

				{error && (
					<div className="text-center text-red-500 mb-2">
						Error: {error.message}
					</div>
				)}

				<div className="flex space-x-2 mb-2">
					<Button
						onClick={handleRegenerateWithOptions}
						disabled={isLoading || messages.length === 0}
						size="sm"
					>
						Regenerate
					</Button>
					<Button onClick={stop} disabled={!isLoading} size="sm">
						Stop
					</Button>
					<Button
						onClick={handleClearChat}
						variant="outline"
						size="sm"
					>
						Clear Chat
					</Button>
					<Button
						onClick={handleCustomMessage}
						variant="outline"
						size="sm"
					>
						Send Custom
					</Button>
				</div>

				<form
					onSubmit={e => handleSubmit(e, {allowEmptySubmit: true})}
					className="flex space-x-2"
				>
					<Input
						className="flex-1"
						value={input}
						onChange={handleInputChange}
						placeholder="Type your message..."
						disabled={isLoading}
						autoFocus
					/>
					<Button type="submit">Send</Button>
				</form>
			</div>
		</div>
	);
};

export default ChatAdvancedExample;
