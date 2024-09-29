import { MEMORYSETS } from './constants';
import * as p from '@clack/prompts';

export async function generateLocalEmbeddings(chunks: string[]): Promise<
	{
		embedding: number[];
	}[]
> {
	try {
		// Verify that ollama is running and emebeddings model is enabled.
		await getOllamaEmbeddings('test');

		// Generate embeddings for each chunk
		const embeddingsPromise = await Promise.all(
			chunks.map(chunk => getOllamaEmbeddings(chunk))
		);

		// Extract the embeddings from the response
		const embeddings = embeddingsPromise.map(
			embedding => embedding.embedding
		);

		const openAIEmbeddingsFormat = embeddings.map(embedding => ({
			embedding
		}));

		return openAIEmbeddingsFormat;
	} catch (error) {
		console.error('Error generating embeddings:', error);
		throw error;
	}
}

/**
 * Fetches embeddings from the Ollama API using the provided prompt.
 *
 * @param {string} prompt - The input string for which embeddings are to be generated.
 * @returns {Promise<any>} A promise that resolves to the embeddings data.
 * @throws Will throw an error if the fetch operation fails or the response is not ok.
 */
async function getOllamaEmbeddings(prompt: string): Promise<any> {
	const url = MEMORYSETS.OLLAMA_EMBEDDINGS_ENDPOINT;

	const body = JSON.stringify({
		model: MEMORYSETS.OLLAMA_EMBEDDINGS_MODEL,
		prompt: prompt
	});

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error();
		p.cancel(
			`Error generating embeddings with Ollama. Please ensure that Ollama is running and the embeddings '${MEMORYSETS.OLLAMA_EMBEDDINGS_MODEL}' model is enabled.`
		);
		process.exit(1);
		throw error;
	}
}
