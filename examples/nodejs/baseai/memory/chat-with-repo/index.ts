import { MemoryI } from '@baseai/core';

const memoryChatWithRepo = (): MemoryI => ({
  name: 'chat-with-repo',
  description: '',
  config: {
		useGitRepo: true,
		include: '.',
		extensions: ['*'],
  }
});

export default memoryChatWithRepo;
