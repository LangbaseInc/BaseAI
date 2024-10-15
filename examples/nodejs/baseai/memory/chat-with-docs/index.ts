import {MemoryI} from '@baseai/core';

const buildMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with docs',
	config: {
		useGitRepo: false,
		include: '.',
		extensions: ['*'],
	},
});

export default buildMemory;
