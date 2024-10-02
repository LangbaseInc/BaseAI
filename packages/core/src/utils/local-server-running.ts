import {getApiUrl} from './is-prod';

export async function isLocalServerRunning(): Promise<Boolean> {
	try {
		const endpoint = getApiUrl();

		const response = await fetch(endpoint, {
			mode: 'no-cors',
			cache: 'no-cache', // Prevents caching of the request
		});

		const portUseError = `\nPort 9000 is already in use. \nTerminate the process running on it. \nRun npx baseai@latest dev in an new terminal to start the dev server.\n`;

		if (!response.ok) {
			console.error(portUseError);
			return false;
		}

		const res = (await response.json()) as unknown as {
			success: boolean;
		};

		if (!res.success) {
			console.error(portUseError);
			return false;
		}

		return true;
	} catch (error) {
		// Port is not in use and BaseAI dev server is not running
		console.error(
			`\nBaseAI dev server is not running. \nPlease run npx baseai@latest dev in a new teriminal to start dev server.\n`,
		);
		return false;
	}
}
