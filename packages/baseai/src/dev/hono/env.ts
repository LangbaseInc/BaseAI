import {z} from 'zod';

export const zEnv = z.object({});

export type Env = z.infer<typeof zEnv>;

export type Services = {};

export type HonoEnv = {
	Bindings: Env;
	Variables: {
		userAgent?: string;
	};
};
