import {z} from 'zod';

export const rateLimiterResponseSchema = z.object({
	success: z.boolean(),
	limit: z.number(),
	remaining: z.number(),
	reset: z.number(),
});

export const rateLimiterConfigSchema = z.object({
	limit: z.number(),
	window: z.number(),
});

export const rateLimitErrorSchema = z.object({
	limit: z.number(),
	remaining: z.number(),
	reset: z.number(),
});

export const usageLimiterResponseSchema = z.object({
	success: z.boolean(),
	limit: z.number(),
	remaining: z.number(),
});

export type RateLimiterResponse = z.infer<typeof rateLimiterResponseSchema>;
export type RateLimitErrorResponse = z.infer<typeof rateLimitErrorSchema>;
export type RateLimiterConfig = z.infer<typeof rateLimiterConfigSchema>;

export type UsageLimiterResponse = z.infer<typeof usageLimiterResponseSchema>;
