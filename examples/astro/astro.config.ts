// @ts-check
import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [
		react(),
		tailwind({
			configFile: './tailwind.config.ts',
		}),
	],
	adapter: vercel(),
});
