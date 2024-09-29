import { Button } from '@/components/ui/button';
import { Heading } from '@/components/Heading';

const guides = [
	{
		href: '/docs/pipe/quickstart',
		name: 'Quickstart Pipe Guide',
		description: 'Learn to create a local AI agentic pipe.'
	},
	{
		href: '/docs/memory/quickstart',
		name: 'Quickstart RAG Guide',
		description: 'Build local RAG using BaseAI'
	},
	{
		href: '/docs/tools/quickstart',
		name: 'Quickstart Tools Guide',
		description: 'Learn to create local tools for LLMs.'
	}
];

export function Guides() {
	return (
		<div className="my-16 xl:max-w-none">
			<Heading level={2} id="guides">
				Guides
			</Heading>
			<div className="prose mt-4 grid grid-cols-1 gap-x-3 gap-y-8 border-t border-zinc-900/5 pt-6 dark:prose-invert sm:grid-cols-2 xl:grid-cols-3 dark:border-white/5">
				{guides.map(guide => (
					<div key={guide.href}>
						<h3 className="mt-0">{guide.name}</h3>
						<p>{guide.description}</p>
						<p className="mb-0">
							<Button
								href={guide.href}
								variant="text"
								arrow="right"
							>
								Read more
							</Button>
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
