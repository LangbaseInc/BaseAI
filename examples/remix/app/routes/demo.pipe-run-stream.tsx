import { MetaFunction } from '@remix-run/node';
import PipeStreamExample from '~/components/pipe-stream';
import GoHome from '~/components/ui/go-home';

export const meta: MetaFunction = () => {
	return [
		{ title: 'AI Agent Pipe Stream ⌘' },
		{ name: "description", content: "AI Agent pipe to stream a text completion" },
	];
};


export default function Page() {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				⌘ Langbase AI Agent Pipe: Stream
			</h1>
			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Stream a pipe to stream a text completion
			</p>
			<PipeStreamExample />
		</div>
	);
}
