export interface Memory extends MemoryConfig {
	name: string;
	description?: string;
}

interface MemoryConfig {
	useGit: boolean;
	include: string[];
	gitignore?: boolean | undefined;
	git?:
		| {
				deployedAt?: string | undefined;
				embeddedAt?: string | undefined;
		  }
		| undefined;
}
