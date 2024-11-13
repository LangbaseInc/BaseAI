import { z } from 'zod';

export interface MemoryI {
	name: string;
	description?: string;
	config?: MemoryConfigI;
}

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

export const memoryConfigSchema = z.object({
	useGitRepo: z.boolean(),
	include: z
		.array(z.string().trim().min(1, 'Include pattern must not be empty'))
		.min(1, 'At least one include pattern must be specified')
		.describe('Glob patterns to include files in the memory'),
	gitignore: z.boolean().optional(),
	git: z
		.object({
			deployedAt: z.string().trim().min(1).optional(),
			embeddedAt: z.string().trim().min(1).optional()
		})
		.optional()
});

export type MemoryConfigI = z.infer<typeof memoryConfigSchema>;
