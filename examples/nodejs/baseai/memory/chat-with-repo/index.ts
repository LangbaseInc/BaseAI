import { MemoryI } from '@baseai/core';

const memoryChatWithRepo = (): MemoryI => ({
  name: 'chat-with-repo',
  description: '',
  config: {
		useGitRepo: true,
		include: './examples',
		extensions: ['*'],
  }
});

export default memoryChatWithRepo;
