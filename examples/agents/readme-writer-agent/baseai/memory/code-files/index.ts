import {MemoryI} from '@baseai/core';

const memoryCodeFiles = (): MemoryI => ({
	name: 'code-files',
	description: 'Memory that contains project files',
	useGit: false,
	include: ['documents/**/*'],
});

export default memoryCodeFiles;
