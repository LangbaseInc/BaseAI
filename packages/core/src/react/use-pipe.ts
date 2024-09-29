import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Message, MessageRole} from 'types/pipes';
import {z} from 'zod';
import {getRunner, Runner} from '../helpers';
import {RunResponse} from '../pipes/pipes';
import {isProd} from '../utils/is-prod';

interface PipeRequestOptions {
	headers?: Record<string, string> | Headers;
	body?: any;
	data?: any;
	allowEmptySubmit?: boolean;
}

interface UsePipeOptions {
	apiRoute?: string;
	onResponse?: (message: Message) => void;
	onFinish?: (messages: Message[]) => void;
	onConnect?: () => void;
	onError?: (error: Error) => void;
	threadId?: string;
	initialMessages?: Message[];
	stream?: boolean;
}

const uuidSchema = z.string().uuid();

export function usePipe({
	apiRoute = '/langbase/pipes/run-stream',
	onResponse,
	onFinish,
	onConnect,
	onError,
	threadId: initialThreadId,
	initialMessages = [],
	stream = true,
}: UsePipeOptions = {}) {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);
	const threadIdRef = useRef<string | null>(initialThreadId || null);
	const messagesRef = useRef<Message[]>(initialMessages);
	const isFirstRequestRef = useRef<boolean>(true);

	const updateMessages = useCallback((newMessages: Message[]) => {
		messagesRef.current = newMessages;
		setMessages(newMessages);
	}, []);

	const processStreamResponse = useCallback(
		async (runner: Runner) => {
			let assistantMessage: Message = {role: 'assistant', content: ''};
			updateMessages([...messagesRef.current, assistantMessage]);

			for await (const chunk of runner) {
				if (abortControllerRef.current?.signal.aborted) break;

				const content = chunk.choices[0]?.delta?.content || '';
				assistantMessage.content += content;

				updateMessages([
					...messagesRef.current.slice(0, -1),
					{...assistantMessage},
				]);
				onResponse?.({...assistantMessage});
			}

			onFinish?.(messagesRef.current);
		},
		[updateMessages, onResponse, onFinish],
	);

	const processNonStreamResponse = useCallback(
		(result: RunResponse) => {
			const assistantMessage: Message = {
				role: 'assistant',
				content: result.completion,
			};
			const newMessages = [...messagesRef.current, assistantMessage];
			updateMessages(newMessages);
			onResponse?.(assistantMessage);
			onFinish?.(newMessages);
		},
		[updateMessages, onResponse, onFinish],
	);

	const getMessagesToSend = useCallback(
		(updatedMessages: Message[]): [Message[], boolean] => {
			const isInitialRequest = isFirstRequestRef.current;
			isFirstRequestRef.current = false;

			if (!isProd()) {
				// In local environment, always send all messages and set lastMessageOnly to false
				return [updatedMessages, false];
			}

			if (isInitialRequest) {
				// In production, for the initial request, send all messages
				return [updatedMessages, false];
			} else {
				// In production, for subsequent requests, send only the last message if there are more than initial messages
				const lastMessageOnly =
					updatedMessages.length > initialMessages.length;
				return [
					lastMessageOnly
						? [updatedMessages[updatedMessages.length - 1]]
						: updatedMessages,
					lastMessageOnly,
				];
			}
		},
		[initialMessages],
	);

	const sendRequest = useCallback(
		async (content: string, options: PipeRequestOptions = {}) => {
			abortControllerRef.current = new AbortController();
			const {signal} = abortControllerRef.current;

			try {
				setIsLoading(true);
				setError(null);
				onConnect?.();

				let updatedMessages = messagesRef.current;

				if (content.trim()) {
					// Add new user message only if content is not empty
					updatedMessages = [
						...messagesRef.current,
						{role: 'user' as MessageRole, content},
					];
				}

				updateMessages(updatedMessages);

				const [messagesToSend, lastMessageOnly] =
					getMessagesToSend(updatedMessages);

				// Ensure there's at least one message to send
				if (messagesToSend.length === 0) {
					throw new Error(
						'At least one message or initial message is required',
					);
				}

				const requestBody: any = {
					messages: messagesToSend,
					stream,
					lastMessageOnly,
					...options.body,
				};

				if (
					threadIdRef.current &&
					uuidSchema.safeParse(threadIdRef.current).success
				) {
					requestBody.threadId = threadIdRef.current;
				}

				const response = await fetch(apiRoute, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...(options.headers || {}),
					},
					body: JSON.stringify(requestBody),
					signal,
				});

				if (!response.ok) throw new Error('Failed to send message');

				const newThreadId = response.headers.get('lb-thread-id');
				if (newThreadId) threadIdRef.current = newThreadId;

				if (stream && response.body) {
					await processStreamResponse(getRunner(response.body));
				} else {
					const result: RunResponse = await response.json();
					processNonStreamResponse(result);
				}
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError') {
					setError(err);
					onError?.(err);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[
			apiRoute,
			stream,
			processStreamResponse,
			processNonStreamResponse,
			updateMessages,
			onConnect,
			onError,
			getMessagesToSend,
		],
	);

	const handleSubmit = useCallback(
		(
			event?: {preventDefault?: () => void},
			options: PipeRequestOptions = {},
		) => {
			event?.preventDefault?.();
			const currentInput = input.trim();
			setInput('');
			return sendRequest(currentInput, options);
		},
		[input, sendRequest],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setInput(e.target.value);
		},
		[],
	);

	const sendMessage = useCallback(
		async (
			content: string,
			options: PipeRequestOptions = {},
		): Promise<void> => {
			await sendRequest(content.trim(), options);
		},
		[sendRequest],
	);

	const regenerate = useCallback(
		async (options: PipeRequestOptions = {}): Promise<void> => {
			const lastUserMessage = messagesRef.current.findLast(
				m => m.role === 'user',
			);
			if (!lastUserMessage) return;
			await sendRequest(lastUserMessage.content, options);
		},
		[sendRequest],
	);

	const stop = useCallback(() => {
		abortControllerRef.current?.abort();
		setIsLoading(false);
	}, []);

	return useMemo(
		() => ({
			messages,
			input,
			handleInputChange,
			handleSubmit,
			isLoading,
			error,
			regenerate,
			stop,
			setMessages: updateMessages,
			threadId: threadIdRef.current,
			sendMessage,
		}),
		[
			messages,
			input,
			handleInputChange,
			handleSubmit,
			isLoading,
			error,
			regenerate,
			stop,
			updateMessages,
			sendMessage,
		],
	);
}
