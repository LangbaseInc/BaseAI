import { z } from 'zod';

export interface MemoryI {
	name: string;
	description?: string;
}

export const memoryNameSchema = z
	.string()
	.min(3, 'Memory name must be at least 3 characters long')
	.max(50, 'Memory name must not exceed 50 characters')
	.regex(
		/^[a-zA-Z0-9.-]+$/,
		'Memory name can only contain letters, numbers, dots, and hyphens'
	);

export const docEmbedSchema = z.object({
	memoryName: memoryNameSchema,
	documentName: z.string().trim().min(1)
});
