export interface GitConfig {
	enabled: boolean;
	include: string[];
	gitignore?: boolean;
	deployedAt?: string;
	embeddedAt?: string;
}

export interface MemoryDocumentI {
	name: string;
	size: string;
	content: string;
	blob: Blob;
	path: string;
}

export interface Document {
	meta?: (doc: MemoryDocumentI) => Record<string, string>;
}

export interface Memory {
	name: string;
	description?: string;
	git: GitConfig;
	documents?: Document;
}
