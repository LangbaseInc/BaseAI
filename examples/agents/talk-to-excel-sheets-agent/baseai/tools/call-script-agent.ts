import { ToolI, Pipe } from '@baseai/core';
import pipeExcelAnalysisAgent from '../pipes/excel-analysis-agent';

const pipe = new Pipe(pipeExcelAnalysisAgent());

export async function call_script_agent({customerQuery}: {customerQuery: string}) {
	// Your tool logic here
	const excelAnalysisAgentResp = await pipe.run({
		messages: [{ role: 'user', content: customerQuery }],
	});

	return excelAnalysisAgentResp.completion;
}

const callScriptAgentTool = (): ToolI => ({
	run: call_script_agent, // Name of the function to run
	type: 'function' as const,
	function: {
		name: `call_script_agent`,
		description: `Call this function to provide analysis of the attached excel file with danfo.js script`,
		parameters: {
			type: 'object',
			properties: {
				customerQuery: {
					type: 'string',
					description: 'JavaScript danfo.js script for data analysis'
				}
			},
			required: ['customerQuery']
		}
	}
});

export default callScriptAgentTool;
