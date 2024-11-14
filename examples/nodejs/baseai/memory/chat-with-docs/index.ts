import {MemoryI} from '@baseai/core';

const buildMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with docs',
	useGit: false,
	include: ['documents/**/*'],
});

export default buildMemory;
