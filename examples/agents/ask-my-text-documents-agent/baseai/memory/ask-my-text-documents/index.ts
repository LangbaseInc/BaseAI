import { MemoryI } from '@baseai/core';
import path from 'path';

const memoryAskMyTextDocuments = (): MemoryI => ({
  name: 'ask-my-text-documents',
  description: 'text documents as pdf',
  config: {
		useGitRepo: false,
		dirToTrack: path.posix.join('.'),
		extToTrack: ["*"]
  }
});

export default memoryAskMyTextDocuments;
