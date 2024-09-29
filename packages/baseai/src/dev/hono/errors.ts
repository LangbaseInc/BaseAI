import { z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';
import type { RateLimitErrorResponse } from 'types/api';
import { type AnyZodObject, ZodError } from 'zod';
import { generateErrorMessage } from 'zod-error';
import { fromZodError } from 'zod-validation-error';
import type { HonoEnv } from '../hono/env';

const ErrorCode = z.enum([
	'BAD_REQUEST',
	'FORBIDDEN',
	'INTERNAL_SERVER_ERROR',
	'USAGE_EXCEEDED',
	'DISABLED',
	'NOT_FOUND',
	'CONFLICT',
	'RATE_LIMITED',
	'UNAUTHORIZED',
	'PRECONDITION_FAILED',
	'INSUFFICIENT_PERMISSIONS'
]);

export function errorSchemaFactory(code: z.ZodEnum<any>) {
	return z.object({
		error: z.object({
			code: code.openapi({
				description: 'A machine readable error code.',
				example: code._def.values.at(0)
			}),
			docs: z.string().openapi({
				description:
					'A link to our documentation with more details about this error code',
				example: `https://langbase.com/docs/api-reference/errors/${code._def.values
					.at(0)
					.toLowerCase()}`
			}),
			message: z.string().openapi({
				description: 'A human readable explanation of what went wrong'
			})
		})
	});
}

export const ErrorSchema = z.object({
	success: z.literal(false).openapi({
		description: 'Indicates that the request was not successful'
	}),
	error: z.object({
		code: ErrorCode.openapi({
			description: 'A machine readable error code.',
			example: 'INTERNAL_SERVER_ERROR'
		}),
		status: z.number().openapi({ description: 'The HTTP status code' }),
		message: z.string().openapi({
			description: 'A human readable explanation of what went wrong'
		}),
		docs: z.string().openapi({
			description:
				'A link to our documentation with more details about this error code',
			example:
				'https://langbase.com/docs/api-reference/errors/bad_request'
		}),
		cause: z.instanceof(ZodError).optional(),
		rateLimit: z
			.object({
				limit: z.number().openapi({
					description:
						'The maximum number of requests that you can make per hour'
				}),
				remaining: z.number().openapi({
					description:
						'The number of requests remaining in the current rate limit window'
				}),
				reset: z.number().openapi({
					description:
						'The time at which the current rate limit window resets, in UTC epoch seconds'
				})
			})
			.optional()
	})
});

export type ErrorCodesType = z.infer<typeof ErrorCode>;
export type ErrorSchemaType = z.infer<typeof ErrorSchema>;

function codeToStatus(code: ErrorCodesType): StatusCode {
	switch (code) {
		case 'BAD_REQUEST':
			return 400;
		case 'UNAUTHORIZED':
			return 401;
		case 'FORBIDDEN':
		case 'DISABLED':
		case 'INSUFFICIENT_PERMISSIONS':
		case 'USAGE_EXCEEDED':
			return 403;
		case 'NOT_FOUND':
			return 404;
		case 'CONFLICT':
			return 409;
		case 'PRECONDITION_FAILED':
			return 412;
		case 'RATE_LIMITED':
			return 429;
		case 'INTERNAL_SERVER_ERROR':
			return 500;
	}
}

export class ApiError extends HTTPException {
	public readonly code: ErrorCodesType;
	public readonly success: boolean;
	public readonly rateLimit?: RateLimitErrorResponse;
	public readonly docs?: string;

	constructor({
		status,
		code,
		message,
		rateLimit,
		docs
	}: {
		status?: StatusCode;
		code: ErrorCodesType;
		message: string;
		rateLimit?: RateLimitErrorResponse;
		docs?: string;
	}) {
		super(status || codeToStatus(code), { message });
		this.code = code;
		this.success = false;
		this.rateLimit = rateLimit;
		this.docs = docs;
	}
}

export class ApiErrorZod extends HTTPException {
	public readonly code: ErrorCodesType;

	constructor({
		code,
		validationResult,
		customMessage
	}: {
		code: ErrorCodesType;
		validationResult: { success: boolean; error?: ZodError };
		customMessage?: string;
	}) {
		let message = '';
		if (validationResult.error) {
			const _customMessage = customMessage ? customMessage : ``;
			let _validationMessage = fromZodError(
				validationResult.error
			).toString();
			message = `${_customMessage} HINT: ${_validationMessage}`.trim();
		}

		super(codeToStatus(code), { message });
		this.code = code;
		this.cause = validationResult.error;
	}

	// Helper static method to simplify throwing errors
	static handle({
		code,
		result,
		message
	}: {
		code: ErrorCodesType;
		result: ReturnType<AnyZodObject['safeParse']>;
		message?: string;
	}) {
		if (!result.success) {
			throw new ApiErrorZod({
				code,
				validationResult: result,
				customMessage: message
			});
		}
	}
}

/**
 * Handles errors and returns a response object.
 *
 * @param err - The error object.
 * @param c - The context object.
 * @returns The response object.
 */
export function handleError(err: Error, c: Context<HonoEnv>): Response {
	if (err instanceof ApiError) {
		return c.json<ErrorSchemaType, StatusCode>(
			{
				success: false,
				error: {
					code: err.code,
					status: err.status,
					message: err.message,
					docs:
						err.docs ||
						`https://langbase.com/docs/api-reference/errors/${err.code.toLowerCase()}`,
					rateLimit: err.rateLimit as
						| RateLimitErrorResponse
						| undefined
				}
			},
			{ status: err.status }
		);
	}

	if (err instanceof ApiErrorZod) {
		return c.json<ErrorSchemaType, StatusCode>(
			{
				success: false,
				error: {
					code: err.code,
					status: err.status,
					message: err.message,
					docs: `https://langbase.com/docs/api-reference/errors/${err.code.toLowerCase()}`,
					cause: err.cause as ZodError | undefined
				}
			},
			{ status: err.status }
		);
	}

	return c.json<ErrorSchemaType, StatusCode>(
		{
			success: false,
			error: {
				code: 'INTERNAL_SERVER_ERROR',
				status: 500,
				message: 'Something unexpected happened.',
				docs: 'https://langbase.com/docs/api-reference/errors/internal_server_error'
			}
		},
		{ status: 500 }
	);
}

export function errorResponse(
	c: Context,
	code: ErrorCodesType,
	message: string
) {
	return c.json<ErrorSchemaType, StatusCode>(
		{
			success: false,
			error: {
				code: code,
				status: codeToStatus(code),
				message,
				docs: `https://langbase.com/docs/api-reference/errors/${code.toLowerCase()}`
			}
		},
		{ status: codeToStatus(code) }
	);
}

export function handleZodError(
	result:
		| {
				success: true;
				data: any;
		  }
		| {
				success: false;
				error: ZodError;
		  },
	c: Context
) {
	if (!result.success) {
		return c.json<ErrorSchemaType, StatusCode>(
			{
				success: false,
				error: {
					code: 'BAD_REQUEST',
					status: 400,
					docs: 'https://langbase.com/docs/api-reference/errors/bad_request',
					message: generateErrorMessage(result.error.issues, {
						maxErrors: 1,
						delimiter: {
							component: ': '
						},
						path: {
							enabled: true,
							type: 'objectNotation',
							label: ''
						},
						code: {
							enabled: true,
							label: ''
						},
						message: {
							enabled: true,
							label: ''
						},
						suffix: ', See "https://langbase.com/docs/api-reference" for more details'
					}),
					cause: result.error
				}
			},
			{ status: 400 }
		);
	}
}
