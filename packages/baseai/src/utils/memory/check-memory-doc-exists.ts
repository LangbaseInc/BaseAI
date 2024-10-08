import * as p from '@clack/prompts';
import { checkMemoryExists } from './check-memory-exist';
import { loadMemoryFiles } from './load-memory-files';
import color from 'picocolors';
import { validateMemoryDocNames } from './lib';

type Spinner = ReturnType<typeof p.spinner>;

export const isMemoryDocExist = async ({
	memoryName,
	documentName,
	spinner
}: {
	memoryName: string;
	documentName: string;
	spinner: Spinner;
}) => {
	if (!memoryName) {
		p.cancel(
			'Memory name is required. Use --memory or -m flag to specify.'
		);
		process.exit(1);
	}

	if (!documentName) {
		p.cancel(
			'Document name is required. Use --document or -d flag to specify.'
		);
		process.exit(1);
	}

	// 1- Check memory exists.
	const { memoryName: validMemoryName, documentName: validDocumentName } =
		validateMemoryDocNames({
			memoryName,
			documentName
		});

	// 2- Check if memory exists.
	await checkMemoryExists(validMemoryName);

	// 3- Load memory data.
	spinner.start('Loading docs...');
	const memoryFiles = await loadMemoryFiles(validMemoryName);

	if (memoryFiles.length === 0) {
		p.cancel(`No valid documents found in memory '${memoryName}'.`);
		process.exit(1);
	}

	// Find the document file.
	const memoryFile = memoryFiles.find(
		file => file.name === validDocumentName
	);

	if (!memoryFile) {
		spinner.stop(`Stopped!`);
		p.cancel(
			`Doc: ${color.cyan(validDocumentName)} not found in memory ${validMemoryName}`
		);
		process.exit(1);
	}

	return {
		memoryFile,
		validMemoryName,
		validDocumentName
	};
};
