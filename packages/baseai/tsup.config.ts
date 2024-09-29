import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm'],
	sourcemap: true,
	// target: 'esnext',
	target: 'node16',
	outDir: 'dist',
	splitting: false,
	bundle: true,
	minify: true,
	external: ['react', 'svelte', 'vue']
});
