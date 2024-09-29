import {beforeEach, describe, expect, it, vi} from 'vitest';
import {GenerateOptions, Pipe, RunResponse, StreamResponse} from './pipes';

// Mock the Request class
vi.mock('../common/request');

describe('Pipe', () => {
	let pipe: Pipe;
	const mockApiKey = 'test-api-key';

	beforeEach(() => {
		pipe = new Pipe({apiKey: mockApiKey});
		vi.resetAllMocks();
	});

	describe('generateText', () => {
		it('should call request.post with correct parameters for non-chat generation', async () => {
			const mockOptions: GenerateOptions = {
				messages: [{role: 'user', content: 'Hello'}],
			};
			const mockResponse: RunResponse = {
				completion: 'Hello, how can I help you?',
				raw: {
					id: 'test-id',
					object: 'test-object',
					created: 123456789,
					model: 'test-model',
					choices: [
						{
							index: 0,
							message: {
								role: 'assistant',
								content: 'Hello, how can I help you?',
							},
							logprobs: null,
							finish_reason: 'stop',
						},
					],
					usage: {
						prompt_tokens: 5,
						completion_tokens: 10,
						total_tokens: 15,
					},
					system_fingerprint: null,
				},
			};

			const mockPost = vi.fn().mockResolvedValue(mockResponse);
			(pipe as any).request = {post: mockPost};

			const result = await pipe.generateText(mockOptions);

			expect(mockPost).toHaveBeenCalledWith({
				endpoint: '/beta/generate',
				body: {...mockOptions, stream: false},
			});
			expect(result).toEqual(mockResponse);
		});

		it('should call request.post with correct parameters for chat generation', async () => {
			const mockOptions: GenerateOptions = {
				messages: [{role: 'user', content: 'Hello'}],
				chat: true,
			};
			const mockResponse: RunResponse = {
				completion: 'Hello! How can I assist you today?',
				threadId: 'chat-thread-123',
				raw: {
					id: 'chat-id',
					object: 'chat-object',
					created: 123456789,
					model: 'chat-model',
					choices: [
						{
							index: 0,
							message: {
								role: 'assistant',
								content: 'Hello! How can I assist you today?',
							},
							logprobs: null,
							finish_reason: 'stop',
						},
					],
					usage: {
						prompt_tokens: 5,
						completion_tokens: 12,
						total_tokens: 17,
					},
					system_fingerprint: null,
				},
			};

			const mockPost = vi.fn().mockResolvedValue(mockResponse);
			(pipe as any).request = {post: mockPost};

			const result = await pipe.generateText(mockOptions);

			expect(mockPost).toHaveBeenCalledWith({
				endpoint: '/beta/chat',
				body: {...mockOptions, stream: false},
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe('streamText', () => {
		it('should call request.post with correct parameters for non-chat streaming', async () => {
			const mockOptions: GenerateOptions = {
				messages: [{role: 'user', content: 'Hello'}],
			};
			const mockStreamResponse: StreamResponse = {
				stream: {} as any,
				threadId: null,
			};

			const mockPost = vi.fn().mockResolvedValue(mockStreamResponse);
			(pipe as any).request = {post: mockPost};

			const result = await pipe.streamText(mockOptions);

			expect(mockPost).toHaveBeenCalledWith({
				endpoint: '/beta/generate',
				body: {...mockOptions, stream: true},
			});
			expect(result).toEqual(mockStreamResponse);
		});

		it('should call request.post with correct parameters for chat streaming', async () => {
			const mockOptions: GenerateOptions = {
				messages: [{role: 'user', content: 'Hello'}],
				chat: true,
			};
			const mockStreamResponse: StreamResponse = {
				stream: {} as any,
				threadId: 'chat-thread-123',
			};

			const mockPost = vi.fn().mockResolvedValue(mockStreamResponse);
			(pipe as any).request = {post: mockPost};

			const result = await pipe.streamText(mockOptions);

			expect(mockPost).toHaveBeenCalledWith({
				endpoint: '/beta/chat',
				body: {...mockOptions, stream: true},
			});
			expect(result).toEqual(mockStreamResponse);
		});
	});
});
