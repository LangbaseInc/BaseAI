import * as p from '@clack/prompts';
import type { LogCategories } from 'types/config';
import Logger from './logger';

let loggerInstance: Logger | null = null;
let initializationPromise: Promise<Logger> | null = null;

export const initLogger = async (): Promise<void> => {
	if (!initializationPromise) {
		initializationPromise = Logger.initialize();
	}
	loggerInstance = await initializationPromise;
};

const getLogger = (): Logger => {
	if (!loggerInstance) {
		p.cancel('Logger has not been initialized. Call initLogger() first.');
		process.exit(1);
	}
	return loggerInstance;
};

export const logger = (
	category: LogCategories,
	value?: unknown,
	logHeader?: string
) => {
	getLogger().log(category, value, logHeader);
};
