import {MemoryI} from '@baseai/core';

const memoryCodeFiles = (): MemoryI => ({
	name: 'code-files',
	description: 'Memory that contains project files',
	git: {
		enabled: false,
		include: ['documents/**/*'],
		gitignore: true,
		deployedAt: '',
		embeddedAt: '',
	},
});

export default memoryCodeFiles;
