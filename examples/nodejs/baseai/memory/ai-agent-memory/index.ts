import {MemoryI} from '@baseai/core';

const memoryAiAgentMemory = (): MemoryI => ({
	name: 'ai-agent-memory',
	description: 'My list of docs as memory for an AI agent pipe',
	config: {
		useGitRepo: true,
		include: ['**/*.md', '!.baseai', '!.baseai/**'],
		gitignore: true,
		git: {
			embeddedAt: 'b7d0aa946f4d9ac7322bf2d84b5e365f4b6a6ed6',
		},
	},
});

export default memoryAiAgentMemory;
