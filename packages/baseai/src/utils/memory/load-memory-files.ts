import * as p from '@clack/prompts';
import fs from 'fs/promises';
import path from 'path';
import { allSupportedExtensions, MEMORYSETS } from './constants';
import { getDocumentContent } from './get-document-content';
import { formatDocSize } from './lib';

export interface MemoryDocumentI {
	name: string;
	size: string;
	content: string;
	blob: Blob;
}

export const loadMemoryFiles = async (
	memoryName: string
): Promise<MemoryDocumentI[]> => {
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

			const isSupportedExtension = allSupportedExtensions.some(
				extension => file.endsWith(extension)
			);

			if (!isSupportedExtension) {
				p.log.warn(`Skipping ${file}; Unsupported file extension.`);
				return null;
			}

			return {
				name: file,
				size: formatDocSize(fileContentBlob.size),
				content: await getDocumentContent(fileContentBlob),
				blob: fileContentBlob
			};
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
