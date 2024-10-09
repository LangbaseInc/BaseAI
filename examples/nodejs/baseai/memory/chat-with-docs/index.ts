import {MemoryI} from '@baseai/core';
import path from 'path';

const buildMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with docs',
	config: {
		useGitRepo: false,
		dirToTrack: path.posix.join(''),
		extToTrack: ['*'],
	},
});

export default buildMemory;
