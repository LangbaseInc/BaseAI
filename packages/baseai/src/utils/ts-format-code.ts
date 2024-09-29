import * as prettier from 'prettier';

/**
 * Formats the given TypeScript code string using Prettier with specified options.
 *
 * @param code - The TypeScript code to format.
 * @returns A promise that resolves to the formatted code string.
 */
export async function formatCode(code: string) {
	return await prettier.format(code, {
		parser: 'typescript',
		singleQuote: true,
		trailingComma: 'none',
		arrowParens: 'avoid',
		printWidth: 80,
		useTabs: true,
		semi: true,
		tabWidth: 4
	});
}
