/**
 * Adds JSON mode if enabled and supported by the current model
 *
 * @param {string} pipe - The pipe config.
 * @param {string} prompt - The system prompt.
 * @returns {string} The prompt with JSON mode line added.
 */

import { jsonModeModels } from '@/data/models';
import { defaultJsonPrompt } from '@/dev/data/globals';
import type { Pipe } from '@/dev/routes/beta/pipes/run';

export function addJsonMode({
	pipe,
	systemPrompt
}: {
	pipe: Pipe;
	systemPrompt: string;
}) {
	// Return the system prompt if JSON mode is not enabled
	if (!pipe.meta?.json) return systemPrompt;
	// Return the system prompt if JSON mode is not supported by the current model
	if (!jsonModeModels.includes(pipe.model.name)) return systemPrompt;

	const jsonModePrompt = getJsonPrompt(pipe);

	// Add JSON mode if enabled & supported by model
	return `${systemPrompt}\n\n${jsonModePrompt}`;
}

function getJsonPrompt(pipe: Pipe): string {
	const jsonPrompt =
		pipe.messages.find(m => m.role === 'system' && m.name === 'json')
			?.content || '';

	// Use default prompt if json prompt is empty or not set
	const useDefaultPrompt = jsonPrompt === '';
	return useDefaultPrompt ? defaultJsonPrompt : jsonPrompt;
}
