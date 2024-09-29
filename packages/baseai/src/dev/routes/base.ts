export const registerRoot = (app: any) =>
	app.get('/', (c: any) => {
		return c.json({
			success: true,
			message: 'BaseAI Local API',
			link: 'https://langbase.com/docs'
		});
	});
