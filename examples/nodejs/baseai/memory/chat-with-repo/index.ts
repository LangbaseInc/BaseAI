import {MemoryI} from '@baseai/core';

const memoryChatWithRepo = (): MemoryI => ({
	name: 'chat-with-repo',
	description: '',
	git: {
		enabled: true,
		include: ['examples/**/*'],
		gitignore: true,
		deployedAt: '',
		embeddedAt: '',
	},
});

export default memoryChatWithRepo;
