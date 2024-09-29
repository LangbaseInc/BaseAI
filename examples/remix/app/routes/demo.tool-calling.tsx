import { MetaFunction } from '@remix-run/node';
import PipeRunToolExample from '~/components/pipe-run-with-tool';
import GoHome from '~/components/ui/go-home';

export const meta: MetaFunction = () => {
	return [
		{ title: 'AI Agent Pipe Tool ⌘' },
		{ name: "description", content: "Run an AI agent with a tool" },
	];
};


export default function Page() {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				AI Agent Pipes: Tool Calling
			</h1>
			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Run a pipe with tool calling.
			</p>
			<PipeRunToolExample />
		</div>
	);
}
