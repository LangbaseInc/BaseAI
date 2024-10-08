import { heading } from '@/utils/heading';
import { isMemoryDocExist } from '@/utils/memory/check-memory-doc-exists';
import { generateEmbeddings } from '@/utils/memory/generate-embeddings';
import * as p from '@clack/prompts';
import color from 'picocolors';

export async function embedDoc({
	memoryName,
	documentName,
	overwrite = false
}: {
	memoryName: string;
	documentName: string;
	overwrite?: boolean;
}) {
	p.intro(
		heading({
			text: 'EMBED DOC',
			sub: `Creating embeddings of Doc: ${color.cyan(documentName)} in memory ${color.cyan(memoryName)}`
		})
	);

	// Spinner to show current action.
	const spinner = p.spinner();

	try {
		const { memoryFile, validMemoryName } = await isMemoryDocExist({
			spinner,
			memoryName,
			documentName
		});

		// Generate embeddings.
		spinner.message('Generating embeddings...');
		const result = await generateEmbeddings({
			memoryFiles: [memoryFile],
			memoryName: validMemoryName,
			overwrite: overwrite || false
		});

		spinner.stop(result);
	} catch (error: any) {
		spinner.stop(`FAILED from here: ${error.message}`);
		process.exit(1);
	}
}
