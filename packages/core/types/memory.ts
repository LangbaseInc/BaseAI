export interface Memory {
	name: string;
	description?: string;
	config?: MemoryConfig;
}

interface MemoryConfig {
	useGitRepo: boolean;
	include: string;
	extensions: string[];
	deployedCommitHash?: string;
	embeddedCommitHash?: string;
}
