import { z } from 'zod';

export interface Tool {
	run: (...args: any[]) => Promise<any> | any;
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, any>;
	};
}

export interface PipeTool {
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, any>;
	};
}
export const pipeToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		description: z.string().optional(),
		parameters: z.record(z.any()).optional()
	})
});
