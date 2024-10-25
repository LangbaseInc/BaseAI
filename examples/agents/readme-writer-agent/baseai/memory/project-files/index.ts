import {MemoryI} from '@baseai/core';
import path from 'path';

const memoryProjectFiles = (): MemoryI => ({
	name: 'project-files',
	description: 'Open-source project files memory',
	config: {
		useGitRepo: true,
		dirToTrack: path.posix.join('.'),
		extToTrack: ['*'],
	},
});

export default memoryProjectFiles;
