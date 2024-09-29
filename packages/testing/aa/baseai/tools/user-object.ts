import { ToolI } from '@baseai/core';

export async function userObject() {
	// Your tool logic here
}

const userObjectTool = (): ToolI => ({
	run: userObject, // Name of the function to run
	type: 'function' as const,
	function: {
		name: `userObject`,
		description: `convert text to user objection`,
		parameters: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: 'Name of the user'
				}
			},
			required: ['name']
		}
	}
});

export default userObjectTool;
