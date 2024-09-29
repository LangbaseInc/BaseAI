import * as p from '@clack/prompts';
import fs from 'fs/promises';
import path from 'path';
import { heading } from '../heading';
import { getAvailableMemories } from '../memory/get-available-memories';
import { embedMemory } from '@/memory/embed';

const configDir = path.join(process.cwd(), 'baseai');
const configFilePath = path.join(configDir, 'baseai.config.ts');

export async function setLocalEmbeddingsConfig(value: boolean) {
	try {
		p.intro(heading({ text: 'CONFIG', sub: 'Configure embeddings' }));

		// Read the config file content
		const configContent = await fs.readFile(configFilePath, 'utf-8');

		// Extract the current value of useLocalEmbeddings
		const match = configContent.match(
			/(["']?useLocalEmbeddings["']?\s*:\s*)(true|false)/
		);
		if (!match) {
			console.log('useLocalEmbeddings not found in the config file.');
			return null;
		}

		const oldValue = match[2] === 'true';

		// Update the useLocalEmbeddings value using regex
		const updatedContent = configContent.replace(
			/(["']?useLocalEmbeddings["']?\s*:\s*)(true|false)/,
			`$1${value}`
		);

		// Write the updated content back to the config file
		await fs.writeFile(configFilePath, updatedContent.trim());

		// Check if the new value is different from the old value
		const isNewAndOldValueSame = value === oldValue;

		// If the new value is the same as the old value, log a message and return
		if (isNewAndOldValueSame) {
			console.log(`\nuseLocalEmbeddings is already set to ${value}.\n`);
			return;
		}

		// If the new and old are different, log a message and update the memory embeddings
		console.log(
			`\nUpdated useLocalEmbeddings to ${value} successfully in ${configFilePath}`
		);

		const oldModel = oldValue === true ? 'local Ollama' : 'OpenAI';
		const newModel = value === true ? 'local Ollama' : 'OpenAI';

		p.log.info(
			`\nSwitching from ${oldModel} embeddings to ${newModel} embeddings.\n`
		);

		// Get all memory.
		const memories = await getAvailableMemories();

		// Embed all memories
		for (const memory of memories) {
			await embedMemory({
				memoryName: memory,
				overwrite: true,
				useLocalEmbeddings: value
			});
		}

		// Log a note that users should restart dev server
		p.log.info(
			'Please restart the dev server to apply the changes to the memory embeddings configuration.'
		);
	} catch (error: any) {
		console.error(`Error updating useLocalEmbeddings: ${error.message}`);
	}
}
