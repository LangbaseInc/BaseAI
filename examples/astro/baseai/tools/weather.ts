const getWeather = ({location}: {location: string}) => {
	return `Weather of ${location} is 16`;
};

const toolGetWeather = () => ({
	run: getWeather,
	type: 'function',
	function: {
		name: 'getWeather',
		description: 'Get the current weather of a given location',
		parameters: {
			type: 'object',
			required: ['location'],
			properties: {
				location: {
					type: 'string',
					description: 'The city and state, e.g. San Francisco, CA',
				},
			},
		},
	},
});
export default toolGetWeather;
