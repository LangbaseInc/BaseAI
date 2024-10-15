import type {MemoryI} from '@baseai/core';

const buidMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with given docs',
	config: {
		useGitRepo: false,
		include: '.',
		extensions: ['*'],
	},
});

export default buidMemory;
