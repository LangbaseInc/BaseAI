import {PipeI} from '@baseai/core';
import memoryCodeFiles from '../memory/code-files';

const pipeReadmeWriter = (): PipeI => ({
	// Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
	name: `readme-writer`,
	description: ``,
	status: `public`,
	model: `openai:gpt-4o-mini`,
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 0,
	frequency_penalty: 0,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content:
				'Write a {{level}} README file for an open-source project that effectively communicates its purpose, usage, installation instructions, and contribution guidelines.\n\nThe README should include the following sections:\n\n- **Project Title**: A clear and concise title of the project.\n- **Description**: A brief overview of what the project does and its significance.\n- **Installation Instructions**: Step-by-step guidance on how to install the project.\n- **Usage**: Examples demonstrating how to use the project.\n- **Contributing**: Guidelines for contributing to the project, including how to report issues and submit pull requests.\n- **License**: Information about the project\'s license.\n\n# Output Format\n\nThe output should be structured as a Markdown document with the appropriate headings for each section. Aim for a length of approximately 500-800 words.\n\n# Examples\n\n**Example 1:**\n\n**Input:** Project Title: "WeatherApp"\n**Output:**\n\n# WeatherApp\n\n## Description\nWeatherApp is a simple application that provides real-time weather updates for any location. It uses data from various weather APIs to fetch and display the latest weather information.\n\n## Installation Instructions\n1. Clone the repository: \\`git clone https://github.com/user/weatherapp.git\\`\n2. Navigate to the project directory: \\`cd weatherapp\\`\n3. Install dependencies: \\`npm install\\`\n\n## Usage\nTo run the application, use the command: \\`npm start\\`. Open your browser and go to \\`http://localhost:3000\\`.\n\n## Contributing\nWe welcome contributions! Please fork the repository and submit a pull request for any changes.\n\n## License\nThis project is licensed under the MIT License.\n\n**Example 2:**\n\n**Input:** Project Title: "TaskTracker"\n**Output:**\n\n# TaskTracker\n\n## Description\nTaskTracker is a web application designed to help users manage their tasks efficiently. It offers features like task creation, categorization, and progress tracking.\n\n## Installation Instructions\n1. Clone the repository: \\`git clone https://github.com/user/tasktracker.git\\`\n2. Install the required packages: \\`pip install -r requirements.txt\\`\n3. Run the application: \\`python app.py\\`\n\n## Usage\nOnce the application is running, navigate to \\`http://localhost:5000\\` to access the TaskTracker interface.\n\n## Contributing\nTo contribute, please read our contribution guidelines in the \\`CONTRIBUTING.md\\` file.\n\n## License\nThis project is licensed under the GPL-3.0 License.\n\n(Examples should include detailed project descriptions, installation steps, and usage instructions as they would appear for real open-source projects, using appropriate placeholders for project-specific details.)',
		},
		{name: 'json', role: 'system', content: ''},
		{name: 'safety', role: 'system', content: ''},
		{
			name: 'opening',
			role: 'system',
			content: 'Welcome to Langbase. Prompt away!',
		},
		{
			name: 'rag',
			role: 'system',
			content: `Below is some CONTEXT for you to answer the questions. ONLY generate readme from the CONTEXT. CONTEXT consists of multiple information chunks. `,
		},
	],
	variables: [{name: 'level', value: ''}],
	tools: [],
	memory: [memoryCodeFiles()],
});

export default pipeReadmeWriter;
