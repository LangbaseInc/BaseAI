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
});

export default memoryAiAgentMemory;
