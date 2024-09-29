import slugify from '@sindresorhus/slugify';

/**
 * Checks if a tool with the given name is present in the list of all tools.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.name - The name of the tool to check for.
 * @param {string[]} params.allTools - The list of all tools.
 * @returns {boolean} - Returns `true` if the tool is present, otherwise `false`.
 */
export function isToolPresent({
	name,
	allTools
}: {
	name: string;
	allTools: string[];
}) {
	return allTools.some(tool => {
		return slugify(tool) === slugify(name);
	});
}
