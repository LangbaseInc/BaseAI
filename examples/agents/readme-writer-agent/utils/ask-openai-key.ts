import * as p from '@clack/prompts';
import path from 'path';
import fs from 'fs';

export async function askOpenAIKey({dirName}: {dirName: string}) {
	const envPath = path.join(dirName, '.env');
	const hasEnv = fs.existsSync(envPath);

	if (hasEnv) {
		const envContent = fs.readFileSync(envPath, 'utf-8');
		const hasOpenAIKey = envContent
			.replace('OPENAI_API_KEY=', '')
			.trim()
			.includes('sk-');
		if (hasOpenAIKey) return;
	}

	const openai = await p.group(
		{
			key: () =>
				p.password({
					message: 'Enter your OpenAI API key',
				}),
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			},
		},
	);

	fs.writeFileSync(envPath, `OPENAI_API_KEY="${openai.key.trim()}"\n`);
	p.log.success('OpenAI API key saved successfully.');
	p.log.info('Now you can run the agent.');
	process.exit(0);
}
