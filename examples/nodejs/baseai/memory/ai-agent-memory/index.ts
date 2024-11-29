import {MemoryI} from '@baseai/core';

const memoryAiAgentMemory = (): MemoryI => ({
	name: 'ai-agent-memory',
	description: 'My list of docs as memory for an AI agent pipe',
	git: {
		enabled: true,
		include: ['**/*'],
		gitignore: true,
		deployedAt: '',
		embeddedAt: '',
	},
	documents: {
		meta: doc => {
			// generate a URL for each document
			const url = `https://example.com/${doc.path}`;
			return {
				url,
				name: doc.name,
			};
		},
	},
});

export default memoryAiAgentMemory;
