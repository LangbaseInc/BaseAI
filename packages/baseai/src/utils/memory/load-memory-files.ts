import * as p from '@clack/prompts';
import fs from 'fs/promises';
import path from 'path';
import { allSupportedExtensions, MEMORYSETS } from './constants';
import { getDocumentContent } from './get-document-content';
import { formatDocSize } from './lib';
import loadMemoryConfig from './load-memory-config';
import {
	memoryConfigSchema,
	type DocumentConfigI,
	type MemoryConfigI
} from 'types/memory';
import { execSync } from 'child_process';
import fg from 'fast-glob';

export interface MemoryDocumentI {
	name: string;
	size: string;
	content: string;
	blob: Blob;
	path: string;
	meta: Record<string, string>;
}

export const loadMemoryFiles = async (
	memoryName: string
): Promise<MemoryDocumentI[]> => {
	// Get memory config.
	const memoryConfig = await checkMemoryConfig(memoryName);

	// useDocumentsDir
	const useDocumentsDir = !memoryConfig || !memoryConfig.git.enabled;
	const documentConfig = memoryConfig?.documents;

	// Load files from documents directory.
	if (useDocumentsDir) {
		return await loadMemoryFilesFromDocsDir({ memoryName, documentConfig });
	}

	// Load files from the repo.
	return await loadMemoryFilesFromCustomDir({ memoryName, memoryConfig });
};

/**
 * Loads memory files from a custom directory specified in the memory configuration.
 *
 * @param {Object} params - The parameters for loading memory files.
 * @param {string} params.memoryName - The name of the memory.
 * @param {MemoryConfigI} params.memoryConfig - The configuration for the memory, including the directory to track and the extensions to track.
 * @returns {Promise<MemoryDocumentI[]>} A promise that resolves to an array of memory documents.
 *
 * @throws Will terminate the process if the documents directory does not exist or if it fails to read documents in the memory.
 */
export const loadMemoryFilesFromCustomDir = async ({
	memoryName,
	memoryConfig
}: {
	memoryName: string;
	memoryConfig: MemoryConfigI;
}): Promise<MemoryDocumentI[]> => {
	const includePatterns = memoryConfig.git.include;

	if (!Array.isArray(includePatterns) || includePatterns.length === 0) {
		p.cancel(`No include patterns specified for memory '${memoryName}'`);
		process.exit(1);
	}

	console.log('Reading documents in memory...');

	// Get all files that match the glob patterns and are tracked by git
	let allFiles: string[];
	try {
		// First get all git tracked files
		const gitFiles = new Set([
			...execSync('git ls-files', { encoding: 'utf-8' })
				.split('\n')
				.filter(Boolean),
			...execSync('git ls-files --others --exclude-standard', {
				encoding: 'utf-8'
			})
				.split('\n')
				.filter(Boolean),
			...execSync('git diff --name-only', { encoding: 'utf-8' })
				.split('\n')
				.filter(Boolean)
		]);

		// Then match against glob patterns
		const matchedFiles = await fg(includePatterns, {
			ignore: ['node_modules/**'],
			dot: true,
			gitignore: memoryConfig.git.gitignore || true
		});

		// Only keep files that are both tracked by git and match the patterns
		allFiles = matchedFiles.filter((file: string) => gitFiles.has(file));
	} catch (error) {
		p.cancel(`Failed to read documents in memory '${memoryName}'.`);
		process.exit(1);
	}

	const memoryFilesContent = await Promise.all(
		allFiles.map(async filePath => {
			// Check if the file is allowed
			const isSupportedExtension = allSupportedExtensions.some(
				extension => filePath.endsWith(extension)
			);

			if (!isSupportedExtension) {
				return null;
			}

			let fileContentBuffer: Buffer;
			try {
				fileContentBuffer = await fs.readFile(filePath);
			} catch (error) {
				p.log.warn(`Failed to read file: ${filePath}. Skipping.`);
				return null;
			}

			const fileContentBlob = new Blob([fileContentBuffer]);
			const size = fileContentBlob.size;

			if (size > MEMORYSETS.MAX_DOC_SIZE) {
				p.log.warn(
					`Skipping ${filePath}; File exceeds the maximum size of ${formatDocSize(MEMORYSETS.MAX_DOC_SIZE)}.`
				);
				return null;
			}

			const memoryFile = {
				path: filePath,
				name: path.basename(filePath.replace(/\//g, '-')),
				size: formatDocSize(fileContentBlob.size),
				content: await getDocumentContent(fileContentBlob),
				blob: fileContentBlob
			};

			let meta = {};

			if (memoryConfig?.documents?.meta) {
				meta = memoryConfig.documents.meta(memoryFile) || {};
			}

			return { ...memoryFile, meta };
		})
	);

	const memoryFilesContentFiltered = memoryFilesContent.filter(
		(file): file is MemoryDocumentI => file !== null
	);

	if (memoryFilesContentFiltered.length === 0) {
		return [];
	}

	return memoryFilesContentFiltered;
};

/**
 * Loads memory files from the specified memory directory.
 *
 * @param memoryName - The name of the memory directory to load files from.
 * @returns A promise that resolves to an array of `MemoryDocumentI` objects.
 *
 * @throws Will exit the process if the documents directory does not exist or if reading the directory fails.
 *
 * The function performs the following steps:
 * 1. Constructs the path to the memory directory and the documents subdirectory.
 * 2. Checks if the documents directory exists. If not, logs an error and exits the process.
 * 3. Reads the list of files in the documents directory. If reading fails, logs an error and exits the process.
 * 4. Reads the content of each file and filters out files that:
 *    - Cannot be read.
 *    - Exceed the maximum allowed size.
 *    - Have unsupported file extensions.
 * 5. Returns an array of `MemoryDocumentI` objects representing the valid memory files.
 */
export const loadMemoryFilesFromDocsDir = async ({
	memoryName,
	documentConfig
}: {
	memoryName: string;
	documentConfig?: DocumentConfigI;
}): Promise<MemoryDocumentI[]> => {
	const memoryDir = path.join(process.cwd(), 'baseai', 'memory', memoryName);
	const memoryFilesPath = path.join(memoryDir, 'documents');

	try {
		await fs.access(memoryFilesPath);
	} catch (error) {
		p.cancel(
			`Documents directory for memory '${memoryName}' does not exist.`
		);
		process.exit(1);
	}

	let memoryFiles: string[];
	try {
		memoryFiles = await fs.readdir(memoryFilesPath);
	} catch (error) {
		p.cancel(`Failed to read documents in memory '${memoryName}'.`);
		process.exit(1);
	}

	const memoryFilesContent = await Promise.all(
		memoryFiles.map(async file => {
			// Check if the file is allowed.
			const isSupportedExtension = allSupportedExtensions.some(
				extension => file.endsWith(extension)
			);

			if (!isSupportedExtension) {
				p.log.warn(`Skipping ${file}; Unsupported file extension.`);
				return null;
			}

			const filePath = path.join(memoryFilesPath, file);

			let fileContentBuffer: Buffer;
			try {
				fileContentBuffer = await fs.readFile(filePath);
			} catch (error) {
				p.log.warn(`Failed to read file: ${file}. Skipping.`);
				return null;
			}

			const fileContentBlob = new Blob([fileContentBuffer]);
			const size = fileContentBlob.size;

			if (size > MEMORYSETS.MAX_DOC_SIZE) {
				p.log.warn(
					`Skipping ${file}; File exceeds the maximum size of ${formatDocSize(MEMORYSETS.MAX_DOC_SIZE)}.`
				);
				return null;
			}

			const memoryFile = {
				name: file,
				path: filePath,
				size: formatDocSize(fileContentBlob.size),
				content: await getDocumentContent(fileContentBlob),
				blob: fileContentBlob
			};

			let meta = {};

			if (documentConfig?.meta) {
				meta = documentConfig.meta(memoryFile) || {};
			}

			return { ...memoryFile, meta };
		})
	);

	const memoryFilesContentFiltered = memoryFilesContent.filter(
		(file): file is MemoryDocumentI => file !== null
	);

	if (memoryFilesContentFiltered.length === 0) {
		return [];
	}

	return memoryFilesContentFiltered;
};

/**
 * Asynchronously checks the configuration for a given memory name.
 *
 * @param memoryName - The name of the memory to check the configuration for.
 * @returns A promise that resolves to the memory configuration if it exists and is valid,
 *          resolves to null if the configuration does not exist,
 *          or does not resolve if the configuration is invalid (process exits).
 */
async function checkMemoryConfig(
	memoryName: string
): Promise<MemoryConfigI | null | void> {
	// Load config for memory.
	const memoryConfig = await loadMemoryConfig(memoryName);

	// Check if config exists.
	const configExists = memoryConfig !== null;

	// No config exists for memory.
	if (!configExists) {
		return null;
	}

	// Check if config is valid.
	const validatedConfig = memoryConfigSchema.safeParse(memoryConfig);

	// Config is invalid.
	if (!validatedConfig.success) {
		p.cancel(`Memory '${memoryName}' has an invalid config.`);
		process.exit(1);
	}

	return {
		...memoryConfig
	};
}

export const getMemoryFileNames = async (
	memoryName: string
): Promise<string[]> => {
	const memoryDir = path.join(process.cwd(), 'baseai', 'memory', memoryName);
	const memoryFilesPath = path.join(memoryDir, 'documents');

	try {
		await fs.access(memoryFilesPath);
	} catch (error) {
		p.cancel(
			`Documents directory for memory '${memoryName}' does not exist.`
		);
		process.exit(1);
	}

	try {
		const memoryFiles = await fs.readdir(memoryFilesPath);

		const validFiles = await Promise.all(
			memoryFiles.map(async file => {
				const filePath = path.join(memoryFilesPath, file);
				const stats = await fs.stat(filePath);

				const isSupportedExtension = allSupportedExtensions.some(
					extension => file.endsWith(extension)
				);
				const isNotTooLarge = stats.size <= MEMORYSETS.MAX_DOC_SIZE;

				return isSupportedExtension && isNotTooLarge ? file : null;
			})
		);

		return validFiles.filter((file): file is string => file !== null);
	} catch (error) {
		p.cancel(`Failed to read documents in memory '${memoryName}'.`);
		process.exit(1);
	}
};
