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
		outDir: 'src/pipes/dist',
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue'],
		dts: true,
		clean: false,
		sourcemap: true,
	},
	{
		entry: ['src/helpers/index.ts'],
		outDir: 'src/helpers/dist',
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue'],
		dts: true,
		clean: false,
		sourcemap: true,
	},
	// React APIs
	{
		entry: ['src/react/index.ts'],
		outDir: 'src/react/dist',
		banner: {
			js: "'use client'",
		},
		format: ['cjs', 'esm'],
		external: ['react', 'svelte', 'vue', 'solid-js'],
		dts: true,
		clean: false,
		sourcemap: true,
	},
]);
