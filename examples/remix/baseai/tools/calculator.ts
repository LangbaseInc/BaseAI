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
			`A tool that can evaluate mathematical expressions. ` +
			`Example expressions: ` +
			`'5.6 * (5 + 10.5)', '7.86 cm to inch', 'cos(80 deg) ^ 4'.`,
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
