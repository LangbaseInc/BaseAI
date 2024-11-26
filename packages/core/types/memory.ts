export interface GitConfig {
	enabled: boolean;
	include: string[];
	gitignore?: boolean;
	deployedAt?: string;
	embeddedAt?: string;
}

export interface Memory {
	name: string;
	description?: string;
	git: GitConfig;
}
