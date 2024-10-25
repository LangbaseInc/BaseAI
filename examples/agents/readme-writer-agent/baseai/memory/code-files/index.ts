import {MemoryI} from '@baseai/core';
import path from 'path';

const memoryCodeFiles = (): MemoryI => ({
	name: 'code-files',
	description: 'Memory that contains project files',
	config: {
		useGitRepo: false,
		dirToTrack: path.posix.join('.'),
		extToTrack: ['*'],
	},
});

export default memoryCodeFiles;
