import GoHome from '../../ui/go-home';
import PipeRunToolExample from '../../pipe-run-with-tool';

export const ToolCalling = () => {
	return (
		<div className="w-full max-w-md">
			<GoHome />
			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				⌘ Langbase: Composable Pipe Run
			</h1>

			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Run a pipe that can call another pipe.
			</p>

			<PipeRunToolExample />
		</div>
	);
};
