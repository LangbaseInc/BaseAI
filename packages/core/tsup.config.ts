import {defineConfig} from 'tsup';

export default defineConfig([
	// Universal APIs
	{
		entry: ['src/index.ts'],
		outDir: 'dist',
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue'],
		dts: true,
		clean: true,
		sourcemap: true,
	},
	{
		entry: ['src/pipes/index.ts'],
		outDir: 'pipes/dist',
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue'],
		dts: true,
		clean: true,
		sourcemap: true,
	},
	{
		entry: ['src/helpers/index.ts'],
		outDir: 'helpers/dist',
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue'],
		dts: true,
		clean: true,
		sourcemap: true,
	},
	// React APIs
	{
		entry: ['src/react/index.ts'],
		outDir: 'react/dist',
		banner: {
			js: "'use client'",
		},
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue', 'solid-js'],
		dts: true,
		clean: true,
		sourcemap: true,
	},
]);
