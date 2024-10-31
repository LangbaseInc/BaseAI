import PipeRunToolStreamExample from '@/components/pipe-run-with-tool-stream';
import GoHome from '@/components/ui/go-home';

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
			<PipeRunToolStreamExample />
		</div>
	);
}
