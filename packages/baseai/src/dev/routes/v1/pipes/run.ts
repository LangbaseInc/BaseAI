import { ApiError, ApiErrorZod } from '@/dev/hono/errors';
import { callLLM } from '@/dev/llms/call-llm';
import { dlog } from '@/dev/utils/dlog';
import { handleStreamingResponse } from '@/dev/utils/provider-handlers/streaming-response-handler';
import { logger } from '@/utils/logger-utils';
import { Hono } from 'hono';
import {
	schemaMessage,
	toolChoiceSchema,
	VariablesSchema,
	type PipeModelT
} from 'types/pipe';
import { pipeToolSchema } from 'types/tools';
import { z } from 'zod';

// Schema definitions
const PipeSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: z.enum(['public', 'private']),
	model: z.string(),
	stream: z.boolean(),
	json: z.boolean(),
	store: z.boolean(),
	moderate: z.boolean(),
	top_p: z.number(),
	max_tokens: z.number(),
	temperature: z.number(),
	presence_penalty: z.number(),
	frequency_penalty: z.number(),
	stop: z.array(z.string()),
	tool_choice: z
		.union([z.enum(['auto', 'required', 'none']), toolChoiceSchema])
		.default('auto'),
	parallel_tool_calls: z.boolean(),
	messages: z.array(schemaMessage),
	variables: VariablesSchema,
	tools: z.array(pipeToolSchema).default([]),
	memory: z.array(z.object({ name: z.string().trim().min(1) })).default([])
});

const RequestBodySchema = z.object({
	pipe: PipeSchema,
	stream: z.boolean(),
	messages: z.array(schemaMessage),
	llmApiKey: z.string(),
	variables: VariablesSchema.optional()
});

type RequestBody = z.infer<typeof RequestBodySchema>;

// Helper functions
const validateRequestBody = (body: unknown): RequestBody => {
	const result = RequestBodySchema.safeParse(body);
	if (!result.success) {
		throw new ApiErrorZod({
			code: 'BAD_REQUEST',
			validationResult: result,
			customMessage: 'Invalid request body'
		});
	}
	return result.data;
};

const processLlmResponse = (c: any, body: RequestBody, rawLlmResponse: any) => {
	const isStreaming = body.stream;

	// Non-streaming
	if (!isStreaming && rawLlmResponse?.choices?.length > 0) {
		const completion = rawLlmResponse.choices[0]?.message?.content ?? '';
		const toolCalls = rawLlmResponse.choices[0]?.message?.tool_calls ?? [];
		const isToolCall = toolCalls.length > 0;

		logger('tool', isToolCall, 'Tool calls found');
		logger('tool.calls', toolCalls);
		logger('pipe.completion', completion, 'Pipe completion');
		logger('pipe.response', rawLlmResponse, 'type: (non-streaming)');

		return c.json({ completion, ...rawLlmResponse });
	}

	// Streaming
	if (isStreaming) {
		logger('pipe.response', rawLlmResponse, 'type: (streaming)');
		return handleStreamingResponse({
			response: rawLlmResponse,
			headers: {},
			c
		});
	}
	return c.json({ body });
};

const handleGenerateError = (c: any, error: unknown) => {
	if (error instanceof ApiErrorZod) {
		throw error;
	}

	const errorMessage =
		error instanceof Error
			? error.message
			: 'Unexpected error occurred in /pipe/v1/run';

	dlog('Error /pipe/v1/run.ts:', error);

	throw new ApiError({
		status: error instanceof ApiError ? error.status : 500,
		code: error instanceof ApiError ? error.code : 'INTERNAL_SERVER_ERROR',
		message: errorMessage,
		docs: error instanceof ApiError ? error.docs : undefined
	});
};

// Main endpoint handler
const handleRun = async (c: any) => {
	try {
		const body = await c.req.json();

		const llmKey = (body.llmApiKey as string) || '';
		const hiddenChars = new Array(45).fill('*').join('');
		const redactedKey = llmKey.length
			? llmKey.slice(0, 8) + hiddenChars
			: '';

		const logData = { ...body, llmApiKey: redactedKey };
		logger('pipe.request', logData, 'Pipe Request Body');

		const validatedBody = validateRequestBody(body);

		const { pipe, messages, llmApiKey, stream, variables } = validatedBody;
		const model = pipe.model as PipeModelT;

		const rawLlmResponse = await callLLM({
			pipe: {
				...pipe,
				model
			},
			messages,
			llmApiKey,
			stream,
			variables
		});

		return processLlmResponse(c, validatedBody, rawLlmResponse);
	} catch (error: unknown) {
		return handleGenerateError(c, error);
	}
};

// Register the endpoint
export const registerV1PipesRun = (app: Hono) => {
	app.post('/v1/pipes/run', handleRun);
};
