export interface Tool {
	run: (...args: any[]) => Promise<any> | any;
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, any>;
	};
}

export interface PipeTool {
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, any>;
	};
}
