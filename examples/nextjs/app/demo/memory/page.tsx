import PipeRunMemory from '@/components/pipe-run-with-memory';
import GoHome from '@/components/ui/go-home';

export default function Page() {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				AI Agent Pipes: Memory
			</h1>
			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Run a pipe with memory.
			</p>
			<PipeRunMemory />
		</div>
	);
}
