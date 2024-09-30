import GoHome from '../../ui/go-home';
import PipeRunMemory from '../../pipe-run-with-memory';

export const Memory = () => {
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
};
