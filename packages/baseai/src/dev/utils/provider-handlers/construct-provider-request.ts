/**
 * Constructs the request options for the provider API call.
 *
 * @param {any} providerConfigMappedHeaders - Headers mapped according to the provider
 * @param {string} method - The HTTP method for the request. Currently using only POST.
 * @returns {RequestInit} - The fetch options for the request.
 */
export function constructRequest({
	providerConfigMappedHeaders,
	method = 'POST',
}: {
	providerConfigMappedHeaders: any;
	method: string;
}) {
	let baseHeaders: any = {
		'content-type': 'application/json',
	};

	let headers: Record<string, string> = {
		...providerConfigMappedHeaders,
	};

	// Add any extra headers, forward, passthrough headers here
	headers = {...baseHeaders, ...headers};

	let fetchOptions: RequestInit = {
		method,
		headers,
	};

	// If the method is GET, delete the content-type header
	if (method === 'GET' && fetchOptions.headers) {
		let headers = fetchOptions.headers as Record<string, unknown>;
		delete headers['content-type'];
	}

	return fetchOptions;
}
