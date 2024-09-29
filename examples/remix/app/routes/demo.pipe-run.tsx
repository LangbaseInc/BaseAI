import { MetaFunction } from '@remix-run/node';
import PipeRunExample from '~/components/pipe-run';
import GoHome from '~/components/ui/go-home';


export const meta: MetaFunction = () => {
	return [
		{ title: 'Pipe ⌘ ' },
		{ name: "description", content: "Run a pipe" },
	];
};

export default function Page() {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				⌘ Langbase AI Agent Pipe: Run
			</h1>

			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Run a pipe to generate a text completion
			</p>

			<PipeRunExample />
		</div>
	);
}
