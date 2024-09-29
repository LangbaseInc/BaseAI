import chalk from 'chalk';
import util from 'util';

const DEBUG = false;
const LOG_SENSITIVE_DATA = false;

const SENSITIVE_WORDS: readonly string[] = [
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

const formatValue = (value: unknown): string => {
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
};

const isSensitiveData = (key: string): boolean =>
	SENSITIVE_WORDS.some(word => key.toLowerCase().includes(word));

const redactSensitiveData = (value: unknown, isSensitive: boolean): string =>
	isSensitive && !LOG_SENSITIVE_DATA
		? chalk.red('======REDACTED======')
		: formatValue(value);

const logKeyValue = (key: string, value: unknown, sensitive?: string): void => {
	const formattedValue = redactSensitiveData(
		value,
		Boolean(sensitive) && isSensitiveData(sensitive || key)
	);
	console.log(
		`\n${chalk.blue('======')} 👀 ${chalk.bold(key)} 👀 ${chalk.blue('======')}`
	);
	console.log(formattedValue);
};

export const dlog = (
	anyKey: unknown,
	anyValue?: unknown,
	sensitive?: string
): void => {
	if (!DEBUG) return;

	if (
		typeof anyKey === 'object' &&
		anyKey !== null &&
		anyValue === undefined
	) {
		Object.entries(anyKey).forEach(([key, value]) =>
			logKeyValue(key, value, sensitive || key)
		);
	} else {
		logKeyValue(String(anyKey), anyValue, sensitive);
	}
};
