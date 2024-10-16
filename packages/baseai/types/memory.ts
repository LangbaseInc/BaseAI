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
		.string()
		.trim()
		.min(1, 'Directory to track must not be empty'),
	extensions: z.union([
		z.tuple([z.literal('*')]),
		z
			.array(
				z
					.string()
					.trim()
					.regex(
						/^\.\w+$/,
						'File extension must start with a dot followed by alphanumeric characters'
					)
			)
			.min(1, 'At least one file extension must be specified')
	]),
	deployedCommitHash: z.string().optional(),
	embeddedCommitHash: z.string().optional()
});

export type MemoryConfigI = z.infer<typeof memoryConfigSchema>;
