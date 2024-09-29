module.exports = {
	root: true,
	extends: [
		'@langbase/eslint-config/library.js',
		'plugin:prettier/recommended', // prettier
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	plugins: ['prettier'], // prettier
	rules: {
		'prettier/prettier': 'error', // prettier
	},
};
