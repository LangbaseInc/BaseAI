import fs from 'fs';
import path from 'path';

export async function getAvailablePipes() {
	// Construct the path containing all pipes folders.
	const pipesPath = path.join(process.cwd(), 'baseai', 'pipes');

	// Check if the baseai directory exists.
	if (!fs.existsSync(pipesPath)) return [];

	// Get all directories names in the pipe path.
	const pipeNames = await fs.promises.readdir(pipesPath);

	// Make complete paths for each pipe.
	const slugifiedPipes = pipeNames.map(pipeName =>
		pipeName.replace('.ts', '')
	);

	// Return the pipe names.
	return slugifiedPipes;
}
