import {MemoryI} from '@baseai/core';

const buidMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with given docs',
	git: {
		enabled: false,
		include: ['documents/**/*'],
		gitignore: true,
		deployedAt: '',
		embeddedAt: '',
	},
});

export default buidMemory;
