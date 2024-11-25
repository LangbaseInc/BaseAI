import { z } from 'zod';

export const memoryNameSchema = z
	.string()
	.min(3, 'Memory name must be at least 3 characters long')
	.max(50, 'Memory name must not exceed 50 characters')
	.regex(
		/^[a-zA-Z0-9.-]+$/,
		'Memory name can only contain letters, numbers, dots, and hyphens'
	);

export const docNameSchema = z.string().trim().min(1);

export const memoryDocSchema = z.object({
	memoryName: memoryNameSchema,
	documentName: docNameSchema
});

export const gitConfigSchema = z.object({
	enabled: z.boolean(),
	include: z
		.array(z.string().trim().min(1, 'Include pattern must not be empty'))
		.min(1, 'At least one include pattern must be specified')
		.describe('Glob patterns to include files in the memory'),
	gitignore: z.boolean().optional().default(true),
	deployedAt: z.string().trim().optional().default(''),
	embeddedAt: z.string().trim().optional().default('')
});

export const memoryConfigSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	git: gitConfigSchema
});

export type GitConfigI = z.infer<typeof gitConfigSchema>;

export type MemoryConfigI = z.infer<typeof memoryConfigSchema>;

export type MemoryI = MemoryConfigI;
