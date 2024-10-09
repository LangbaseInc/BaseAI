import {MemoryI} from '@baseai/core';
import path from 'path';

const buidMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with given docs',
	config: {
		useGitRepo: false,
		dirToTrack: path.posix.join(''),
		extToTrack: ['*'],
	},
});

export default buidMemory;
