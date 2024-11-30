import { MemoryI } from '@baseai/core';

const memoryReportAnalysis = (): MemoryI => ({
	name: 'report-analysis',
	description: 'memory used report generator',
});

export default memoryReportAnalysis;
