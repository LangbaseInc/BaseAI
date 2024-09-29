/**
 * Lib file for memory module
 *
 * All functions return {data: any|null, error: string|null}
 */
import * as p from '@clack/prompts';
import fs from 'fs';
import type { Message } from 'types/pipe';
import { fromZodError } from 'zod-validation-error';
import type { Pipe } from '../../dev/routes/beta/pipes/run';
import { defaultRagPrompt, MEMORYSETS } from './constants';
import {
	cosineSimilaritySearch,
	getDocumentsFromMemory,
	type SimilarChunk
} from './db/lib';
// import { generateLocalEmbeddings } from './generate-local-embeddings';
import { dlog } from '@/dev/utils/dlog';
import { docEmbedSchema, memoryNameSchema } from 'types/memory';
import { loadConfig } from '../config/config-handler';
import { logger } from '../logger-utils';
import { generateLocalEmbeddings } from './generate-local-embeddings';
import { getOpenAIEmbeddings } from './generate-openai-embeddings';

export async function checkDirectoryExists(directoryPath: string) {
	try {
		await fs.promises.access(directoryPath);
		return {
			data: true,
			error: null
		};
	} catch (error: any) {
		console.log('utils/memory/lib.ts: checkDirectoryExists: error:', error);
		return {
			data: null,
			error: getErrorMsg(error, 'Error checking directory exists')
		};
	}
}

export const getErrorMsg = (error: any, defaultMsg: string) => {
	const isErrorMessage = error instanceof Error;
	const errorMessage = isErrorMessage
		? error.message.trim() || defaultMsg
		: defaultMsg;
	return errorMessage;
};

/**
 * Formats the given number of bytes into a human-readable string representation.
 * @param bytes - The number of bytes to format.
 * @returns A string representing the formatted size.
 */
export function formatDocSize(bytes: number): string {
	if (bytes === 0) return '0 bytes';

	if (bytes < 1024) {
		return bytes.toFixed(2) + ' bytes';
	} else if (bytes < 1024 * 1024) {
		const fileSizeInKB = bytes / 1024;
		return fileSizeInKB.toFixed(2) + ' KB';
	} else {
		const fileSizeInMB = bytes / (1024 * 1024);
		return fileSizeInMB.toFixed(2) + ' MB';
	}
}

/**
 * Validates the given memory name.
 *
 * @param memoryName - The name of the memory to validate.
 * @returns The validated memory name.
 * Logs error and exits process if the memory name is invalid.
 */
export const validateMemoryName = (memoryName: string) => {
	const validatedName = memoryNameSchema.safeParse(memoryName);
	if (!validatedName.success) {
		const err = fromZodError(validatedName.error).message;
		p.cancel(`Invalid memory name: ${err}`);
		process.exit(1);
	}
	return validatedName.data;
};

export const validatedocEmbedSchema = ({
	memoryName,
	documentName
}: {
	memoryName: string;
	documentName: string;
}) => {
	const validatedData = docEmbedSchema.safeParse({
		memoryName,
		documentName
	});
	if (!validatedData.success) {
		const err = fromZodError(validatedData.error).message;
		p.cancel(`Invalid input: ${err}`);
		process.exit(1);
	}
	return validatedData.data;
};

export const getAugmentedContext = ({
	similarChunks,
	messages
}: {
	similarChunks: SimilarChunk[];
	messages: Message[];
}) => {
	if (similarChunks.length === 0) return '';

	const memoryContext = similarChunks
		.map(chunk => `${chunk.text} \n\n Source: ${chunk.attributes.docName}`)
		.join('\n\n');

	// Extract Rag prompt from the messages.
	const ragMsg = messages.find(m => m.role === 'system' && m.name === 'rag');
	// If there is no rag prompt, use the default rag prompt.
	const ragPrompt = ragMsg?.content || defaultRagPrompt;

	const contextContent = `"""CONTEXT:\n ${memoryContext}"""`;
	const augmentedContext = `"""${ragPrompt}""" \n\n ${contextContent}`;

	return augmentedContext;
};

export const addContextFromMemory = async ({
	pipe,
	messages,
	memoryNames
}: {
	pipe: Pipe;
	messages: Message[];
	memoryNames: string[];
}) => {
	try {
		// Check if there are no memory names.
		const isMemoryAttached = memoryNames.length > 0;
		logger('memory', isMemoryAttached, 'Memory attached');

		// Check if there are no messages.
		const messagesExist = messages.length > 0;

		// Return the messages if there are no memory names or messages.
		if (!isMemoryAttached || !messagesExist) return;

		// This will be the user prompt.
		const lastUserMsg = messages.reverse().find(m => m.role === 'user');
		const userPrompt = lastUserMsg?.content;

		// If there is no user prompt, return the messages.
		if (!userPrompt) return;

		// 1- Generate the embeddings of the user prompt.
		// Read config to determine which embedding to use.
		const config = await loadConfig();
		const useLocalEmbeddings = config.memory?.useLocalEmbeddings || false;

		let embeddings = [];
		if (useLocalEmbeddings) {
			// Use local embeddings
			dlog('Generating local embeddings');
			embeddings = await generateLocalEmbeddings([userPrompt]);
		} else {
			// Use OpenAI embeddings
			dlog('Generating OpenAI embeddings');
			embeddings = await getOpenAIEmbeddings([userPrompt]);
		}

		// 2- Get all the memorysets from the db.
		const memoryChunks = await getDocumentsFromMemory(memoryNames);
		if (memoryChunks.length === 0) return;

		// 3- Get similar chunks from the memorysets.
		const similarChunks = cosineSimilaritySearch({
			chunks: memoryChunks,
			queryEmbedding: embeddings[0].embedding,
			topK: MEMORYSETS.MAX_CHUNKS_ATTACHED_TO_LLM
		});
		if (similarChunks.length === 0) return;
		logger('memory.similarChunks', similarChunks);

		return similarChunks;
	} catch (error: any) {
		dlog('utils/memory/lib.ts: addContextFromMemory: error:', error);
	}
};

export const validateEmbedDocInput = ({
	memoryName,
	documentName
}: {
	memoryName: string;
	documentName: string;
}) => {
	const validatedName = memoryNameSchema.safeParse(memoryName);
	if (!validatedName.success) {
		const err = fromZodError(validatedName.error).message;
		p.cancel(`Invalid memory name: ${err}`);
		process.exit(1);
	}
	return validatedName.data;
};
