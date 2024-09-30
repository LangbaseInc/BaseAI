import * as math from 'mathjs';

export async function calculator({expression}: {expression: string}) {
	return math.evaluate(expression);
}

const toolCalculator = () => ({
	run: calculator,
	type: 'function' as const,
	function: {
		name: 'calculator',
		description:
			`A tool for evaluating mathematical expressions. ` +
			`Example expressions: ` +
			`'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.`,
		parameters: {
			type: 'object',
			required: ['expression'],
			properties: {
				expression: {
					type: 'string',
					description: 'The mathematical expression to evaluate.',
				},
			},
		},
	},
});

export default toolCalculator;
