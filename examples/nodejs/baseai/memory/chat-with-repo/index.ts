import {MemoryI} from '@baseai/core';
import path from 'path';

const memoryChatWithRepo = (): MemoryI => ({
	name: 'chat-with-repo',
	description: '',
	config: {
		useGitRepo: true,
		dirToTrack: path.posix.join('.', 'examples'),
		extToTrack: ['*'],
	},
});

export default memoryChatWithRepo;
