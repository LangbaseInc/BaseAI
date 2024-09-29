import { ToolI } from '@baseai/core';

export async function locationObject() {
	// Your tool logic here
}

const locationObjectTool = (): ToolI => ({
	run: locationObject, // Name of the function to run
	type: 'function' as const,
	function: {
		name: `locationObject`,
		description: `convert text to user objection`,
		parameters: {
			type: 'object',
			properties: {
				location: {
					type: 'string',
					description: 'Location of the user'
				}
			},
			required: ['location']
		}
	}
});

export default locationObjectTool;
