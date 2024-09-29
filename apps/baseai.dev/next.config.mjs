
import withSearch from './src/mdx/search.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
	images: {
		domains: ['raw.githubusercontent.com/']
	},
	async redirects() {
		return [];
	}
};

export default withSearch(nextConfig);
