import {act, renderHook} from '@testing-library/react';
import {Message} from 'types/pipes';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import * as isProdModule from '../utils/is-prod'; // Adjust the import path as needed
import {usePipe} from './use-pipe'; // Adjust the import path as needed

// Mock fetch function
global.fetch = vi.fn();

describe('usePipe', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		(global.fetch as any).mockReset();
		vi.spyOn(isProdModule, 'isProd').mockReturnValue(false); // Default to local environment
	});

	const mockInitialMessages = [
		{role: 'user', content: 'Hello'},
		{role: 'assistant', content: 'Hi there!'},
	];

	const setupUsePipe = (options = {}) => {
		return renderHook(() =>
			usePipe({
				initialMessages: mockInitialMessages as Message[],
				...options,
			}),
		);
	};

	describe('initialization', () => {
		it('should initialize with correct initial state', () => {
			const {result} = setupUsePipe();
			expect(result.current.messages).toEqual(mockInitialMessages);
			expect(result.current.input).toBe('');
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('updateMessages', () => {
		it('should update messages correctly', () => {
			const {result} = setupUsePipe();
			const newMessages = [
				...mockInitialMessages,
				{role: 'user', content: 'New message'},
			];

			act(() => {
				result.current.setMessages(newMessages as Message[]);
			});

			expect(result.current.messages).toEqual(newMessages);
		});
	});

	describe('handleInputChange', () => {
		it('should update input correctly', () => {
			const {result} = setupUsePipe();
			const newInput = 'New input';

			act(() => {
				result.current.handleInputChange({
					target: {value: newInput},
				} as React.ChangeEvent<HTMLInputElement>);
			});

			expect(result.current.input).toBe(newInput);
		});
	});

	describe('sendMessage', () => {
		describe('in local environment', () => {
			beforeEach(() => {
				vi.spyOn(isProdModule, 'isProd').mockReturnValue(false);
			});

			it('should send all messages', async () => {
				(global.fetch as any).mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('New message');
				});

				expect(global.fetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining(
							'"messages":' +
								JSON.stringify([
									...mockInitialMessages,
									{role: 'user', content: 'New message'},
								]),
						),
						headers: expect.objectContaining({
							'Content-Type': 'application/json',
						}),
						method: 'POST',
					}),
				);
			});

			it('should not allow empty submissions by default', async () => {
				const {result} = setupUsePipe();

				await expect(result.current.sendMessage('')).rejects.toThrow(
					'Empty message submission is not allowed',
				);
			});

			it('should allow empty submissions when allowEmptySubmit is true', async () => {
				(global.fetch as any).mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('', {
						allowEmptySubmit: true,
					});
				});

				expect(global.fetch).toHaveBeenCalled();
			});

			it('should set lastMessageOnly to false', async () => {
				(global.fetch as any).mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('New message');
				});

				expect(global.fetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining(
							'"lastMessageOnly":false',
						),
					}),
				);
			});
		});

		describe('in production environment', () => {
			beforeEach(() => {
				vi.spyOn(isProdModule, 'isProd').mockReturnValue(true);
			});

			it('should send all messages in the initial request', async () => {
				(global.fetch as any).mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('Initial message');
				});

				expect(global.fetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining(
							'"messages":' +
								JSON.stringify([
									...mockInitialMessages,
									{role: 'user', content: 'Initial message'},
								]),
						),
						headers: expect.objectContaining({
							'Content-Type': 'application/json',
						}),
						method: 'POST',
					}),
				);
			});

			it('should send only the last message in subsequent requests', async () => {
				(global.fetch as any).mockResolvedValue({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('First message');
					await result.current.sendMessage('Second message');
				});

				expect(global.fetch).toHaveBeenCalledTimes(2);
				expect(global.fetch).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining(
							'"messages":[{"role":"user","content":"Second message"}]',
						),
						headers: expect.objectContaining({
							'Content-Type': 'application/json',
						}),
						method: 'POST',
					}),
				);
			});

			it('should set lastMessageOnly to true for subsequent requests', async () => {
				(global.fetch as any).mockResolvedValue({
					ok: true,
					json: () => Promise.resolve({completion: 'Test response'}),
					headers: new Headers(),
				});

				const {result} = setupUsePipe();

				await act(async () => {
					await result.current.sendMessage('First message');
					await result.current.sendMessage('Second message');
				});

				expect(global.fetch).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining('"lastMessageOnly":true'),
					}),
				);
			});
		});

		it('should handle errors', async () => {
			(global.fetch as any).mockRejectedValueOnce(
				new Error('Network error'),
			);

			const {result} = setupUsePipe();

			await act(async () => {
				await result.current.sendMessage('New message');
			});

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('Network error');
		});
	});

	describe('regenerate', () => {
		it('should regenerate last user message', async () => {
			(global.fetch as any).mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({completion: 'Regenerated response'}),
				headers: new Headers(),
			});

			const {result} = setupUsePipe();

			await act(async () => {
				await result.current.sendMessage('User message');
				await result.current.regenerate();
			});

			expect(global.fetch).toHaveBeenCalledTimes(2);
			expect(
				result.current.messages[result.current.messages.length - 1],
			).toEqual({
				role: 'assistant',
				content: 'Regenerated response',
			});
		});
	});

	describe('handleSubmit', () => {
		it('should send message and clear input', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({completion: 'Test response'}),
				headers: new Headers(),
			});

			const {result} = setupUsePipe();

			act(() => {
				result.current.handleInputChange({
					target: {value: 'Submit message'},
				} as React.ChangeEvent<HTMLInputElement>);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.input).toBe('');
			expect(
				result.current.messages[result.current.messages.length - 2],
			).toEqual({
				role: 'user',
				content: 'Submit message',
			});
		});
	});

	describe('stop', () => {
		it('should abort the current request and set isLoading to false', async () => {
			const abortMock = vi.fn();
			const mockAbortController = {
				abort: abortMock,
				signal: {},
			};
			vi.spyOn(global, 'AbortController').mockImplementation(
				() => mockAbortController as any,
			);

			const {result} = setupUsePipe();

			// Simulate starting a request
			(global.fetch as any).mockImplementation(
				() => new Promise(() => {}),
			); // Never resolves
			result.current.sendMessage('Test message');

			await act(async () => {
				result.current.stop();
			});

			expect(abortMock).toHaveBeenCalled();
			expect(result.current.isLoading).toBe(false);
		});
	});
});
