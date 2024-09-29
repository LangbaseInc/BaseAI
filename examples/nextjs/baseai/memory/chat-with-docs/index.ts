import { MemoryI } from '@baseai/core';

const buidMemory = (): MemoryI => ({
	name: 'chat-with-docs',
	description: 'Chat with given docs',
});

export default buidMemory;
