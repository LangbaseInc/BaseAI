import { MetaFunction } from '@remix-run/node';
import PipeRunPipesAsTools from '~/components/pipe-run-pipes-as-tools';
import GoHome from '~/components/ui/go-home';

export const meta: MetaFunction = () => {
	return [
		{ title: 'AI Agent with Pipes as Tools ⌘' },
		{ name: "description", content: "Run an AI agent with pipes as tools" },
	];
};

export default function Page() {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				⌘ Langbase: Composable Pipe Run
			</h1>
			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Run a pipe that can call another pipe.
			</p>
			<PipeRunPipesAsTools />
		</div>
	);
}
