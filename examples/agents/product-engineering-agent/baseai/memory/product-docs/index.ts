import { MemoryI } from '@baseai/core';
import path from 'path';

const memoryProductDocs = (): MemoryI => ({
  name: 'product-docs',
  description: 'data for product engineering insights',
});

export default memoryProductDocs;
