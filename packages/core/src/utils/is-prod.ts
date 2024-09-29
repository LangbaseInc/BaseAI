const FORCE_PROD = false;
const TEST_PROD_LOCALLY = FORCE_PROD;

export function isProd() {
	if (TEST_PROD_LOCALLY) return true;
	return process.env.NODE_ENV === 'production';
}

export function isLocal() {
	return process.env.NODE_ENV !== 'production';
}

export function getApiUrl() {
	// TODO: Make local port configurable.
	return isProd() ? 'https://api.langbase.com' : 'http://localhost:9000';
	// return isProd() ? 'http://localhost:8787' : 'http://localhost:9000';
}
