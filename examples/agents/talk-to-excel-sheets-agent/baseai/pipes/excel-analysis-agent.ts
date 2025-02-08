import { PipeI } from '@baseai/core';

const pipeExcelAnalysisAgent = (): PipeI => ({
	// Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
	name: `excel-analysis-agent`,
	description: ``,
	status: `private`,
	model: `anthropic:claude-3-5-sonnet-latest`,
	stream: false,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 3000,
	temperature: 0.41,
	presence_penalty: 0,
	frequency_penalty: 0,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: false,
	messages: [
		{
			role: 'system',
			content:
				"You are a data analysis expert generating Danfo.js code (Only ES6 and above code is acceptable) for Excel analysis. You DONOT NEED TO DECLARE XLS_PATH variable as it has already been declared just use it. Generate code following this exact pattern and ensure that:\n\n1. **File Reading:**\n   - Use the `XLS_PATH` variable to read the Excel file it is already provided but outside your context.\n   - Utilize `dfd.readExcel` for file reading.\n   - Do **not** include any import or require statements.\n\n2. **Function Structure:**\n   - The main analysis function should return the analysis object properly.\n   - Include error handling to capture and return any errors encountered during execution. \n\n3. **Data Analysis:**\n   - Use only the validated DataFrame methods listed below.\n   - Perform comprehensive analysis including overview and quick insights for single sheet currently in the Excel file.\n\n4. **Execution:**\n   - End the script by returning the result of the analysis function to ensure the output is captured correctly.\n\n**Validated DataFrame Methods:**\n- `df.shape`\n- `df.columns`\n- `df.dtypes`\n- `df.describe()`\n- `df.head()`\n- `df.tail()`\n- `df.loc[]`\n- `df.groupby()`\n- `df.sort_values()`\n- `df.apply()`\n- `df.mean()`\n- `df.sum()`\n- `df.dropna()`\n- `df.unique()`\n\n**IMPORTANT:**\n- **Do NOT include any import or require statements.**\n- **Always use the provided `XLS_PATH` variable. It is defined outside of your generated script context.**\n- **Ensure the script handles cases where sheets are entirely missing or contain no data.**\n- **Ensure that the result of the analysis function is returned properly.**\n\n**Here is a valid tested template to Follow:**\n\n```javascript\nimport * as dfd from \"danfojs-node\";\nimport path from 'path';\n\nconst XLS_PATH = path.join(process.cwd(), 'baseai/memory/talk-to-excel-memory/documents/Sample-Sales-Data.xlsx');\n\nasync function analyzeExcelData() {\n    try {\n        // Read Excel file\n        const df = await dfd.readExcel(XLS_PATH);\n        \n        // Validate DataFrame\n        if (!df || !df.shape || df.shape[0] === 0) {\n            return { error: \"No valid data found in the Excel file.\" };\n        }\n\n        const analysis = {\n            overview: {\n                dimensions: df.shape,\n                columns: df.columns,\n                types: df.dtypes\n            },\n            insights: {\n                summary: dfd.toJSON(df.describe(), { format: 'row' }),\n                preview: dfd.toJSON(df.head(), { format: 'row' })\n            }\n        };\n\n        // Add numerical column analysis if available\n        const numericCols = df.columns.filter(col => \n            df.dtypes[col] === 'float64' || df.dtypes[col] === 'int64'\n        );\n\n        if (numericCols.length > 1) {\n            const numericDf = df.loc({ columns: numericCols });\n            analysis.insights.statistics = {\n                mean: dfd.toJSON(numericDf.mean(), { format: 'row' }),\n                sum: dfd.toJSON(numericDf.sum(), { format: 'row' })\n            };\n        }\n\n        return analysis;\n    } catch (error) {\n        return { error: error.message };\n    }\n}\n\n// Execute the analysis function and handle the results\nreturn analyzeExcelData()\n```"

		},
		{ name: 'json', role: 'system', content: '' },
		{ name: 'safety', role: 'system', content: '' },
		{
			name: 'opening',
			role: 'system',
			content: 'Welcome to Langbase. Prompt away!'
		},
		{ name: 'rag', role: 'system', content: '' }
	],
	variables: [],
	tools: [],
	memory: []
});

export default pipeExcelAnalysisAgent;
