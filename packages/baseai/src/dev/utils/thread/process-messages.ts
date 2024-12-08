import type { Message, Pipe, VariableI, VariablesI } from 'types/pipe';
import { dlog } from '../dlog';

/**
 * Process the messages to replace variables with their values
 * Replaces variables in messages content with their values
 */
export function processMessages({
	pipe,
	messages,
	variables
}: {
	pipe: Pipe;
	messages: Message[];
	variables?: VariablesI;
}) {
	const variablesMap = getVarsMap({ pipe, variables });

	const messagesWithVarsValues = replaceVarsInMessagesWithVals({
		messages,
		variablesMap
	});
	return { messages: messagesWithVarsValues, variablesMap };
}

function getVarsMap({
	pipe,
	variables
}: {
	pipe: Pipe;
	variables?: VariablesI;
}) {
	const hasPipeVars = pipe.variables ? pipe.variables.length > 0 : false;
	const hasCurrentPromptVars = variables ? variables.length > 0 : false;

	const pipeVars = hasPipeVars ? pipe.variables : [];
	const currentPromptVars = hasCurrentPromptVars ? variables : [];

	let finalVariablesMap: Map<string, string> = new Map();

	if (hasPipeVars) {
		pipeVars.forEach((v: { name: string; value: string }) =>
			finalVariablesMap.set(v.name, v.value)
		);
	}

	if (hasCurrentPromptVars) {
		currentPromptVars?.forEach((v: VariableI) =>
			finalVariablesMap.set(v.name, v.value)
		);
	}

	// Convert the map back to an array for debugging
	let finalVariables: VariableI[] = Array.from(
		finalVariablesMap,
		([name, value]) => ({
			name,
			value
		})
	);
	dlog(`finalVariables`, finalVariables);

	return finalVariablesMap;
}

// Function to replace variables in the messages
function replaceVarsInMessagesWithVals({
	messages,
	variablesMap
}: {
	messages: Message[];
	variablesMap: Map<string, string>;
}): Message[] {
	const variableRegex = /{{(.*?)}}/g; // Regex to match double curly braces

	return messages.map(message => {
		// When Assistant requests a tool call,
		// 1- message.content is empty
		// 2- message.role is 'assistant'
		// 3- message.tool_calls is an array of tool calls requested by LLM.

		// 1. If tool call or no content, return msg as is
		const isAssistantToolCall =
			!message.content &&
			message.role === 'assistant' &&
			message.tool_calls?.length;
		if (isAssistantToolCall || !message.content) return message;

		// 2. If the content is an array, replace variables in each item
		if (Array.isArray(message.content)) {
			const updatedContent = message.content.map(contentItem => ({
				...contentItem,

				text: contentItem.text?.replace(
					variableRegex,
					(match, varName) => {
						const trimmedVarName = varName.trim(); // Trim any extra spaces

						// If the variable exists in the map, replace with its value; otherwise, leave the placeholder intact
						return variablesMap.get(trimmedVarName) || match;
					}
				)
			}));
			return {
				...message,
				content: updatedContent
			};
		}

		// 3. If content is a string, replace variables in it
		const updatedContent = message.content.replace(
			variableRegex,
			(match, varName) => {
				const trimmedVarName = varName.trim();

				return variablesMap.get(trimmedVarName) || match;
			}
		);
		return {
			...message,
			content: updatedContent
		};
	});
}
