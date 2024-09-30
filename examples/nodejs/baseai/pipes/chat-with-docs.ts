import {PipeI} from '@baseai/core';
import chatWithDocsMemory from '../memory/chat-with-docs';

const buildPipe = (): PipeI => ({
	apiKey: process.env.LANGBASE_API_KEY!, // Replace with your API key https://langbase.com/docs/api-reference/api-keys
	name: 'chat-with-docs',
	description: '',
	status: 'private',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: false,
	messages: [
		{role: 'system', content: `You are a helpful AI assistant.`},
		{
			role: 'system',
			name: 'rag',
			content:
				"Below is some CONTEXT for you to answer the questions. ONLY answer from the CONTEXT. CONTEXT consists of multiple information chunks. Each chunk has a source mentioned at the end.\n\nFor each piece of response you provide, cite the source in brackets like so: [1].\n\nAt the end of the answer, always list each source with its corresponding number and provide the document name. like so [1] Filename.doc.\n\nIf you don't know the answer, just say that you don't know. Ask for more context and better questions if needed.",
		},
	],
	variables: [],
	memory: [chatWithDocsMemory()],
	tools: [],
});

export default buildPipe;
