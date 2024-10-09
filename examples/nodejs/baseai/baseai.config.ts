export const config = {
	log: {
		isEnabled: true,
		logSensitiveData: false,
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		tool: false,
		memory: false,
	},
	memory: {
		useLocalEmbeddings: false,
	},
	envFilePath: '.env',
};
