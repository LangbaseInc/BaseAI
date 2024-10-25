import * as p from '@clack/prompts';

export async function questions() {
	const readme = await p.group(
		{
			level: () =>
				p.select({
					message:
						'Choose the level of detail you want in the README.',
					options: [
						{label: 'Simple', value: 'simple' as unknown as any},
						{
							label: 'Detailed',
							value: 'detailed' as unknown as any,
						},
					],
				}),
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			},
		},
	);

	return {level: readme.level};
}
