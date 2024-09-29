import PipeStreamExample from '@/components/pipe-stream';
import GoHome from '@/components/ui/go-home';

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
