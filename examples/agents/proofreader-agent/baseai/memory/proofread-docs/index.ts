import { MemoryI } from '@baseai/core';

const memoryProofreadDocs = (): MemoryI => ({
	name: 'proofread-docs',
	description: 'proofreader built with baseai and memory',
});

export default memoryProofreadDocs;
