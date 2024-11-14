import {MemoryI} from '@baseai/core';

const memoryAiAgentMemory = (): MemoryI => ({
	name: 'ai-agent-memory',
	description: '',
	useGit: true,
	include: ['examples/pipe.run.ts', '!.baseai'],
	gitignore: true,
	git: {
		deployedAt: 'f389dac63512f9b633bb0aef938794ef913515f0'
	},
});

export default memoryAiAgentMemory;
