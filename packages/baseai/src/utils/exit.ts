const exit = {
	success: () => {
		process.exit(0);
	},
	fail: () => {
		process.exit(1);
	}
};

export default exit;
