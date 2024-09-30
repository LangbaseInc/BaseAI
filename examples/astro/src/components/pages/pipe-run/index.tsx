import GoHome from '../../ui/go-home';
import PipeRunExample from '../../pipe-run';

export const PipeRun = () => {
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
};
