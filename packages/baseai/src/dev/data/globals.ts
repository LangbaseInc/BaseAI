import {OPEN_AI} from './models';

export const CONTENT_TYPES = {
	APPLICATION_JSON: 'application/json',
	MULTIPART_FORM_DATA: 'multipart/form-data',
	EVENT_STREAM: 'text/event-stream',
	AUDIO_MPEG: 'audio/mpeg',
	APPLICATION_OCTET_STREAM: 'application/octet-stream',
	GENERIC_AUDIO_PATTERN: 'audio',
	PLAIN_TEXT: 'text/plain',
	HTML: 'text/html',
	GENERIC_IMAGE_PATTERN: 'image/',
};

export const REQUEST_TIMEOUT_STATUS_CODE = 408;
export const defaultJsonPrompt = 'Output should be in JSON format.';
export const defaultRagPrompt = `Below is some CONTEXT for you to answer the questions. ONLY answer from the CONTEXT. CONTEXT consists of multiple information chunks. Each chunk has a source mentioned at the end.\n\nFor each piece of response you provide, cite the source in brackets like so: [1].\n\nAt the end of the answer, always list each source with its corresponding number and provide the document name. like so [1] Filename.doc.\n\nIf you don't know the answer, just say that you don't know. Ask for more context and better questions if needed.`;

export const defaultPipeVersionInsert = {
	meta: {
		number: '1',
		stream: true,
		store: true,
		debug: false,
		json: false,
	},
	model: {
		name: 'gpt-4o-mini',
		provider: OPEN_AI,
		tone: 'Custom',
		params: {
			max_tokens: 1000,
			temperature: 0.7,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stop: [],
		},
		tool_choice: 'auto',
		parallel_tool_calls: true,
	},
	prompt: {
		opening: `Welcome to Langbase. Prompt away!`,
		system: `You're a helpful AI assistant.`,
		safety: '',
		messages: [],
		variables: [],
		json: '',
		rag: '',
	},
	memorysets: [],
	pipe_id: '',
	preview: false,
	functions: [],
};
