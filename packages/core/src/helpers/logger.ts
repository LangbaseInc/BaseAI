import {isProd} from '../utils/is-prod';

export class Logger {
	private config: any;

	constructor(config: any) {
		this.config = config;
	}

	log(category: string, value?: unknown, logHeader?: string): void {
		if (isProd(this.config?.env) && !this.config?.log?.isEnabledInProd)
			return;
		if (!this.config?.log?.isEnabled) return;
		if (!this.shouldLog(category)) return;

		console.log('');
		if (logHeader) {
			console.log(`======= ${logHeader} =======`);
		}
		console.log(`=❯ ${category}`);

		if (typeof value === 'object' && value !== null) {
			console.dir(value, {depth: null, colors: true});
		} else if (value !== undefined) {
			console.log(value);
		}
	}

	private shouldLog(category: string): boolean {
		const logConfig = this.config?.log;
		if (!logConfig) return false;

		// Check if the category or its parent category is enabled
		const categoryParts = category.split('.');
		while (categoryParts.length > 0) {
			const currentCategory = categoryParts.join('.');
			if (logConfig[currentCategory] === true) return true;
			if (logConfig[currentCategory] === false) return false;
			categoryParts.pop();
		}

		// If no specific setting found, default to true
		return true;
	}
}
