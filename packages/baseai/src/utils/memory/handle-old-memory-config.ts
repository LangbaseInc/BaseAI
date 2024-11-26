/**
 * Represents the old memory configuration format for backward compatibility.
 */
export interface OldMemoryConfig {
	name: string;
	description?: string;
	config?: OldConfigObject;
}

interface OldConfigObject {
	useGitRepo: boolean;
	dirToTrack: string;
	extToTrack: string[] | ['*'];
	deployedCommitHash?: string;
	embeddedCommitHash?: string;
}

/**
 * Type guard to check if an object is of type `OldConfigObject`.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is an `OldConfigObject`, otherwise `false`.
 */
function isOldConfigObject(obj: unknown): obj is OldConfigObject {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'useGitRepo' in obj &&
		typeof (obj as OldConfigObject).useGitRepo === 'boolean' &&
		'dirToTrack' in obj &&
		typeof (obj as OldConfigObject).dirToTrack === 'string' &&
		'extToTrack' in obj &&
		Array.isArray((obj as OldConfigObject).extToTrack)
	);
}

/**
 * Checks if an object conforms to the old memory configuration format.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is in the old memory configuration format, otherwise `false`.
 */
export function isOldMemoryConfigFormat(obj: unknown): boolean {
	if (
		typeof obj !== 'object' ||
		obj === null ||
		!('name' in obj) ||
		!('config' in obj)
	) {
		return false;
	}

	const typedObj = obj as { name: unknown; config: unknown };

	return (
		typeof typedObj.name === 'string' &&
		(typedObj.config === undefined || isOldConfigObject(typedObj.config))
	);
}

/**
 * Generates upgrade instructions for converting an old memory configuration to the new format.
 *
 * @param oldConfig - The old memory configuration.
 * @returns A string containing the upgrade instructions.
 */
export function generateUpgradeInstructions(
	oldConfig: OldMemoryConfig
): string {
	if (!oldConfig.config) {
		return 'Invalid memory config.';
	}

	const newConfigExample = {
		name: oldConfig.name,
		description: oldConfig.description || 'Your memory description',
		git: {
			enabled: oldConfig.config.useGitRepo,
			include:
				oldConfig.config.extToTrack[0] === '*'
					? [`${oldConfig.config.dirToTrack}/**/*`]
					: oldConfig.config.extToTrack.map(
							ext => `${oldConfig.config?.dirToTrack}/**/*${ext}`
						),
			gitignore: true,
			deployedAt: oldConfig.config.deployedCommitHash || '',
			embeddedAt: oldConfig.config.embeddedCommitHash || ''
		}
	};

	return `
Your memory config is using an outdated format in baseai/memory/${oldConfig.name}/index.ts. Please update the file to this new format:

${JSON.stringify(newConfigExample, null, 2)}

Key changes:
- Removed nested 'config' object structure
- Git-related fields are now grouped under a 'git' object
- 'useGitRepo' is now 'git.enabled'
- 'dirToTrack' and 'extToTrack' are combined into 'git.include' glob patterns
- 'deployedCommitHash' is now 'git.deployedAt'
- 'embeddedCommitHash' is now 'git.embeddedAt'
- Added new 'git.gitignore' field (defaults to true)

For more information, refer to the documentation: https://baseai.dev/docs/guides/memory-from-git
`;
}
