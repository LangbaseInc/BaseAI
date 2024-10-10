export interface Memory {
	name: string;
	description?: string;
	config?: MemoryConfig;
}

interface MemoryConfig {
	useGitRepo: boolean;
	dirToTrack: string;
	extToTrack: string[];
	deployedCommitHash?: string;
	embeddedCommitHash?: string;
}
