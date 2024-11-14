import {MemoryI} from '@baseai/core';

const memoryChatWithRepo = (): MemoryI => ({
	name: 'chat-with-repo',
	description: '',
	useGit: true,
	include: ['examples/**/*'],
	gitignore: true,
});

export default memoryChatWithRepo;
