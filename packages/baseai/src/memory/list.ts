import { heading } from '@/utils/heading';
import icons from '@/utils/icons';
import { getAvailableMemories } from '@/utils/memory/get-available-memories';
import * as p from '@clack/prompts';

export async function listMemory() {
	const availableMemories = await getAvailableMemories();
	if (availableMemories.length === 0) {
		p.log.message('No memory available.');
		return;
	}
	p.intro(
		heading({
			text: 'MEMORY',
			sub: 'List of all available memory sets'
		})
	);
	console.log('');
	availableMemories.forEach(item => {
		console.log(`${icons.memory} ${item}`);
	});

	process.exit(0);
}
