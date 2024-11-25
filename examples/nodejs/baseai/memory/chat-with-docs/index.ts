import {MemoryI} from '@baseai/core';

const buildMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with docs',
	git: {
		enabled: false,
		include: ['documents/**/*'],
		gitignore: true,
		deployedAt: '',
		embeddedAt: '',
	},
});

export default buildMemory;
