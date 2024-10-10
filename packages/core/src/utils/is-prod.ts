const FORCE_PROD = false;
const TEST_PROD_LOCALLY = FORCE_PROD;

type ConfigEnv = {
	NODE_ENV?: string;
	[key: string]: any;
};

export function isProd(configEnv?: ConfigEnv): boolean {
	if (TEST_PROD_LOCALLY) return true;

	const env = configEnv?.NODE_ENV ?? process.env.NODE_ENV;
	return env === 'production';
}

export function isLocal(configEnv?: ConfigEnv): boolean {
	return !isProd(configEnv);
}

export function getApiUrl(configEnv?: ConfigEnv): string {
	return isProd(configEnv)
		? 'https://api.langbase.com'
		: 'http://localhost:9000';
}
