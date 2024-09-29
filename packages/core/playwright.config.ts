// Importing the PlaywrightTestConfig type from the Playwright test library
import type {PlaywrightTestConfig} from '@playwright/test';
// Importing devices configuration from the Playwright test library
import {devices} from '@playwright/test';

// Setting the PORT variable to the environment's PORT or defaulting to 3000
const PORT = process.env.PORT || 3000;
// Constructing the base URL using the PORT variable
const baseURL = `http://localhost:${PORT}`;

/**
 * Configuration object for Playwright tests.
 * For more details, refer to https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	// Directory where the end-to-end test specifications are located
	testDir: './tests/e2e/spec',
	// Template path for storing snapshots
	snapshotPathTemplate: './tests/e2e/__snapshots__/{testFilePath}/{arg}{ext}',
	// Global timeout for each test in milliseconds
	timeout: 20_000,
	// Configuration for expectations
	expect: {
		// Timeout for assertions in milliseconds
		timeout: 10_000,
	},
	// Indicates if tests should run in parallel
	fullyParallel: false,
	// Number of worker processes for running tests
	workers: 3,
	// Number of retry attempts for failed tests
	retries: 2,
	// Reporter configuration based on whether the environment is CI
	reporter: process.env.CI ? [['github'], ['json', {outputFile: 'test-results.json'}]] : 'list',
	// Projects configuration for different browsers/devices
	projects: [
		{
			// Name of the project
			name: 'chromium',
			// Using the Desktop Chrome configuration from devices
			use: devices['Desktop Chrome'],
		},
	],
	// Shared context configuration for tests
	use: {
		// Base URL for the tests
		baseURL,
		// Trace configuration to retain traces on test failure
		trace: 'retain-on-failure',
		// Custom user agent for the tests
		userAgent: 'playwright-test bot',
	},
	// Configuration for the web server that runs during tests
	webServer: {
		// Current working directory for the server command
		cwd: './tests/e2e/next-server',
		// Command to start the development server
		command: 'pnpm run dev',
		// URL to check if the server is up
		url: baseURL,
		// Timeout for the server to start in milliseconds
		timeout: 120 * 1000,
		// Whether to reuse an existing server if available
		reuseExistingServer: false,
	},
};

// Exporting the configuration object as the default export
export default config;
