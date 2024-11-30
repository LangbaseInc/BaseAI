import { MemoryI } from '@baseai/core';
import path from 'path';

const memoryTalkToExcelMemory = (): MemoryI => ({
  name: 'talk-to-excel-memory',
  description: 'Sample excel file for analysis with BaseAI memory and tools call support',
});

export default memoryTalkToExcelMemory;
