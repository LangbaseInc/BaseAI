import { ToolI } from '@baseai/core';

export async function get_current_weather() {
	// Your tool logic here
}

const getCurrentWeatherTool = (): ToolI => ({
	run: get_current_weather, // Name of the function to run
	type: 'function' as const,
	function: {
		name: `get_current_weather`,
		description: `Get the current weather in a given location`,
		parameters: {
			type: 'object',
			properties: {
				unit: {
					enum: ['celsius', 'fahrenheit'],
					type: 'string'
				},
				location: {
					type: 'string',
					description: 'The city and state, e.g. San Francisco, CA'
				}
			},
			required: ['location']
		}
	}
});

export default getCurrentWeatherTool;
