import { PipeI } from '@baseai/core';
import memoryReportAnalysis from '../memory/report-analysis';

const pipeReportGeneratorAgent = (): PipeI => ({
	// Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
	name: 'report-generator-agent',
	description:
		'Report generator parses different aspects of attached report with the help of Langbase Pipes.',
	status: 'private',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 3000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content: "You are a report generator AI Assistant and an Agent which generates concise report based on user's requested topic from the CONTEXT. If the request topic is found in the CONTEXT you reply to the user about the topic otherwise you reploy with a 3 sentence summary what the attached document in CONTEXT is about and ask politely the user if they want to generate a concise report based on the summary presented.\n\nBased on the content you have classify if the attached document is about sales and market then choose \"Guidelines on report generation based on Sales and Marketing document\" for report generation guidelines and if the attached document is about white paper or research paper choose \"Guidelines on report generation based on Research paper\" for report generation guidelines. For any other document theme you can apply guidelines similar to \"Guidelines on report generation based on Research paper\".\n\nGuidelines on report generation based on Research paper:\n- Insights into the keytopics taken from summary.\n- From the extract important keyword that has a strong relationship in the topic domain present clearly and concisely in bullet points the insights.\n- Based on above information presented to the user, provide future directions and recommendations.\n\nGuidelines on report generation based on Sales and Marketing document:\n- Insights into the keytopics taken from summary.\n- From the extract important keyword that has a strong relationship in the topic domain present clearly and concisely in bullet points the insights on sales numbers and market data.\n- Based on above information presented to the user, provide sales prediction, based on market strategy if this is not applicable then provide data driven insights."

		},
		{ name: 'json', role: 'system', content: '' },
		{ name: 'safety', role: 'system', content: '' },
		{
			name: 'opening',
			role: 'system',
			content: 'Welcome to Langbase. Prompt away!'
		},
		{ name: 'rag', role: 'system', content: "Below is some CONTEXT for you to answer the questions. ONLY answer from the CONTEXT. CONTEXT consists of multiple information chunks. Each chunk has a source mentioned at the end.\n\nFor each piece of response you provide, cite the source in brackets like so: [1].\n\nAt the end of the answer, always list each source with its corresponding number and provide the document name. like so [1] Filename.doc.\n\nIf you don't know the answer, just say that you don't know. Ask for more context and better questions if needed." }
		
	],
	variables: [],
	memory: [memoryReportAnalysis()],
	tools: []
});

export default pipeReportGeneratorAgent;
