import { MemoryI } from '@baseai/core';

const buidMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with docs',
});

export default buidMemory;
