import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Maps environment variables from `import.meta.env` to `process.env`.
 * 
 * This function iterates over all keys in `import.meta.env` and assigns
 * each value to the corresponding key in `process.env`. This is useful
 * for ensuring that environment variables are accessible in a Node.js
 * environment when using tools like Vite or Astro that provide `import.meta.env`.
 */
export function mapMetaEnvToProcessEnv() {
	Object.keys(import.meta.env).forEach(key => {
		process.env[key] = import.meta.env[key];
	});
}
