import { MemoryI } from '@baseai/core';
import path from 'path';

const memoryMemoDocs = (): MemoryI => ({
  name: 'memo-docs',
  description: 'memory documents',
  config: {
		useGitRepo: false,
		dirToTrack: path.posix.join(''),
		extToTrack: ['*']
  }
});

export default memoryMemoDocs;
