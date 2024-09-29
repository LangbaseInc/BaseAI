import { heading } from '@/utils/heading';
import { checkMemoryExists } from '@/utils/memory/check-memory-exist';
import { generateEmbeddings } from '@/utils/memory/generate-embeddings';
import { validateMemoryName } from '@/utils/memory/lib';
import { loadMemoryFiles } from '@/utils/memory/load-memory-files';
import * as p from '@clack/prompts';
import color from 'picocolors';

export async function embedMemory({
	memoryName: memoryNameInput,
	overwrite,
	useLocalEmbeddings
}: {
	memoryName: string;
	overwrite?: boolean;
	useLocalEmbeddings?: boolean;
}) {
	// Spinner to show current action.
	const s = p.spinner();

	try {
		p.intro(
			heading({
				text: 'EMBED',
				sub: `Creating embeddings of ${color.cyan(memoryNameInput)}`
			})
		);

		if (!memoryNameInput) {
			p.cancel(
				'Memory name is required. Use --memory or -m flag to specify.'
			);
			process.exit(1);
		}

		// 1- Check memory exists.
		const memoryName = validateMemoryName(memoryNameInput);
		await checkMemoryExists(memoryName);

		// 2- Load memory data.
		s.start('Processing memory docs...');
		const memoryFiles = await loadMemoryFiles(memoryName);

		if (memoryFiles.length === 0) {
			p.cancel(`No valid documents found in memory '${memoryName}'.`);
			process.exit(1);
		}

		// 3- Generate embeddings.
		s.message('Generating embeddings...');
		const result = await generateEmbeddings({
			memoryFiles,
			memoryName,
			overwrite: overwrite || false,
			useLocalEmbeddings
		});

		s.stop(result);
	} catch (error: any) {
		s.stop(`Stopped!`);
		p.cancel(`FAILED: ${error.message}`);
		process.exit(1);
	}
}
