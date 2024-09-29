import fs from 'fs';
import path from 'path';
import { defaultConfig } from './config-handler';

const configDir = path.join(process.cwd(), 'baseai');
const configFilePath = path.join(configDir, 'baseai.config.ts');

// Function to check and create the default config if it doesn't exist
export async function createDefaultConfig() {
	try {
		// Check if the config file already exists
		if (fs.existsSync(configFilePath)) {
			// console.log(`Config file already exists at ${configFilePath}`);
			return;
		}
		console.log(
			`No Config file found. Creating default BaseAI config at ${configFilePath}`
		);

		// Create the baseai folder if it doesn't exist
		await fs.promises.mkdir(configDir, { recursive: true });

		// Default content for the config file (you can adjust this)
		const configContent = `import type {BaseAIConfig} from '@baseai/core';

		export const config: BaseAIConfig = ${JSON.stringify(defaultConfig, null, 2)};
		`;

		// Write the default config to baseai.config.ts
		await fs.promises.writeFile(configFilePath, configContent.trim());

		console.log(`Default config created successfully at ${configFilePath}`);
	} catch (error: any) {
		console.error(`Error creating default config file: ${error.message}`);
	}
}
