export interface Memory {
	name: string;
	description?: string;
	config?: MemoryConfig;
}

interface MemoryConfig {
	useGitRepo: boolean;
	include: string[];
	gitignore?: boolean | undefined;
	git?:
		| {
				deployedAt?: string | undefined;
				embeddedAt?: string | undefined;
		  }
		| undefined;
}
