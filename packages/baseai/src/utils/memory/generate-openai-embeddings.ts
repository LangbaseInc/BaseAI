import * as p from '@clack/prompts';
import { getEncoding } from 'js-tiktoken';
import OpenAI from 'openai';
import { MEMORYSETS } from './constants';

export const getOpenAIEmbeddings = async (
	chunks: string[]
): Promise<OpenAI.Embeddings.Embedding[]> => {
	const openAiKey = process.env.OPENAI_API_KEY;

	if (!openAiKey) {
		p.cancel(
			'OpenAI key not found. Please set the OPENAI_API_KEY environment variable. Only required locally, in production, add it to your keysets https://langbase.com/docs/features/keysets'
		);
		process.exit(1);
	}

	try {
		const openaiAPIClient = new OpenAI({
			apiKey: openAiKey
		});

		// Verify that each input has tokens less than the limit.
		const enc = getEncoding('cl100k_base');
		let totalTokens = 0;
		for (const chunk of chunks) {
			const tokens = enc.encode(chunk).length;
			totalTokens += tokens;
			if (tokens > MEMORYSETS.EMBEDDING_MODEL_TOKENS_LIMIT) {
				throw new Error(
					`Input exceeds the maximum token limit of ${MEMORYSETS.EMBEDDING_MODEL_TOKENS_LIMIT}.`
				);
			}
		}

		const openAiEmbeddings: OpenAI.Embeddings.Embedding[] = [];
		const batchSize = MEMORYSETS.EMBEDDING_MAX_BATCH_SIZE; // OpenAI limit is 2048.
		for (let i = 0; i < chunks.length; i += batchSize) {
			const batch = chunks.slice(i, i + batchSize);
			const { data: openAiEmbeddingsBatch } =
				await openaiAPIClient.embeddings.create({
					model: MEMORYSETS.EMBEDDING_MODEL,
					dimensions: MEMORYSETS.EMBEDDING_DIMENSIONS,
					input: batch,
					encoding_format: MEMORYSETS.EMBEDDING_ENCODING_FORMAT
				});
			openAiEmbeddings.push(...openAiEmbeddingsBatch);
		}

		return openAiEmbeddings;
	} catch (error: any) {
		console.error('Error:', error);
		throw new Error('Error getting OpenAI embeddings');
	}
};
