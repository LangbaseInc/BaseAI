import chalk from 'chalk';
import util from 'util';
import { loadConfig } from './config/config-handler';
import type { LogCategories, LoggerConfig } from 'types/config';
import sym from 'log-symbols';
const blueI = chalk.blue.inverse;

const sensitiveWords = [
	'sensitive',
	'secret',
	'hide',
	'private',
	'password',
	'token',
	'key',
	'auth',
	'authorization',
	'redact'
];

class Logger {
	private static instance: Logger;
	private config: LoggerConfig;

	private constructor(config: LoggerConfig) {
		this.config = config;
	}

	public static async initialize(): Promise<Logger> {
		if (!Logger.instance) {
			const baseAIConfig = await loadConfig();
			Logger.instance = new Logger(baseAIConfig.log);
		}
		return Logger.instance;
	}

	private formatValue(value: unknown): string {
		if (typeof value === 'object' && value !== null) {
			return util.inspect(value, { colors: true, depth: null });
		}
		if (typeof value === 'string') {
			return chalk.green(`"${value}"`);
		}
		if (typeof value === 'number') {
			return chalk.yellow(value.toString());
		}
		if (typeof value === 'boolean') {
			return chalk.cyan(value.toString());
		}
		return String(value);
	}

	private isSensitiveData(key: string): boolean {
		return sensitiveWords.some(word => key.toLowerCase().includes(word));
	}

	private formatAndRedactSensitiveData(
		value: unknown,
		isSensitive: boolean
	): string {
		return isSensitive && !this.config.logSensitiveData
			? chalk.red('======REDACTED======')
			: this.formatValue(value);
	}

	private isCategoryEnabled(category: LogCategories): boolean {
		const parts = category.split('.');
		let partialCategory = '';

		for (const part of parts) {
			partialCategory += (partialCategory ? '.' : '') + part;
			if (partialCategory in this.config) {
				const value = this.config[partialCategory as LogCategories];
				if (typeof value === 'boolean') {
					if (value === false) {
						// console.log(
						// 	`Category ${category} is false due to ${partialCategory}`
						// );
						return false;
					}
				}
			}
		}

		// console.log(`Category ${category} is true (default or explicitly set)`);
		return true;
	}

	private logValue(
		category: string,
		value: unknown,
		logHeader?: string
	): void {
		const formattedValue = this.formatAndRedactSensitiveData(
			value,
			this.isSensitiveData(logHeader || category)
		);
		const header = logHeader ? `${chalk.blue.bold(logHeader)}` : '';
		console.log(
			`\n${sym.info} ${blueI(` ${category} `)} ${header}\n${formattedValue}`
		);
	}

	public log(
		category: LogCategories,
		value: unknown,
		logHeader?: string
	): void {
		if (!this.config.isEnabled || !this.isCategoryEnabled(category)) return;

		this.logValue(category, value, logHeader);
	}
}

export default Logger;
