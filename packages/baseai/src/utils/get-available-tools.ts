import fs from 'fs';
import path from 'path';

export async function getAvailableTools() {
	// Construct the path containing all tools folders.
	const toolsPath = path.join(process.cwd(), 'baseai', 'tools');

	// Check if the baseai directory exists.
	if (!fs.existsSync(toolsPath)) return [];

	// Get all directories names in the tool path.
	const toolsNames = await fs.promises.readdir(toolsPath);

	// Make complete paths for each tool.
	const toolsPaths = toolsNames.map(toolName => toolName.replace('.ts', ''));

	// Return the tool names.
	return toolsPaths;
}
