import OpenAI from 'openai';
import type { Message } from 'types/pipe';

export async function moderate({
	openai,
	prompt
}: {
	openai: OpenAI;
	prompt: {
		messages: Message[];
		variables: any[];
	};
}) {
	// Construct a string representation of the prompt
	let promptText = '';

	// Process messages if they exist
	if (prompt.messages && prompt.messages.length > 0) {
		for (const message of prompt.messages) {
			promptText += message.content + '\n';
		}
	}

	// Process variables if they exist
	if (prompt.variables && prompt.variables.length > 0) {
		for (const variable of prompt.variables) {
			promptText += `${variable.name}: ${variable.value}\n`;
		}
	}

	// Perform moderation on the constructed prompt text
	const moderation = await openai.moderations.create({ input: promptText });
	const result = moderation?.results[0];
	// dlog('moderation:', result);

	// Content is flagged by OpenAI's moderation
	if (result.flagged) {
		// Filter categories to only include those that are true
		const flaggedCategories = Object.entries(result.categories)
			.filter(([, value]) => value === true)
			.map(([key]) => key.replace('/', ' or ')); // Replace slashes for readability

		const reasons = flaggedCategories.join(', ');

		// Construct and return the error message
		return {
			flagged: result.flagged,
			reason: `Content flagged by OpenAI moderation endpoint due to: ${reasons}`
		};
	}

	return {
		flagged: result.flagged,
		reason: 'Content passed OpenAI moderation successfully'
	};
}
