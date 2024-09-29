import path from 'path';
import fs from 'fs';

export async function getAvailableMemories() {
	try {
		// Construct the path containing all memories folders.
		const memoryPath = path.join(process.cwd(), 'baseai', 'memory');

		// Check if the baseai directory exists.
		if (!fs.existsSync(memoryPath)) return [];

		// Get all directories names in the memory path.
		const memoryNames = await fs.promises.readdir(memoryPath);

		// Return the memory names.
		return memoryNames;
	} catch (error: any) {
		return [];
	}
}
