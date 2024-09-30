type Section = {
	title: string;
	href: string;
};

export type Link = {
	title: string;
	href: string;
	sections?: Section[];
};

export type NavigationItem = {
	title: string;
	links: Link[];
	isCommand?: boolean;
};

const navigationData: NavigationItem[] = [
	{
		title: 'Documentation',
		links: [
			{
				title: 'Introduction',
				href: '/docs'
			},
			{
				title: 'Start with Learn',
				href: '/learn'
			},
			{
				title: '1. Create an AI Pipe',
				href: '/learn/create-pipe'
			},
			{
				title: '2. Create an AI Memory',
				href: '/learn/create-memory'
			},
			{
				title: '3. Create an AI Tool',
				href: '/learn/create-tool'
			},
			{
				title: '4. Deploy AI RAG',
				href: '/learn/deploy-rag-on-langbase'
			},
			{
				title: 'Composable AI',
				href: '/docs/composable-ai'
			},
			{
				title: 'Supported LLMs & Providers',
				href: '/docs/supported-models-and-providers'
			}
		]
	},

	{
		title: 'Getting Started',
		links: [
			{
				title: 'Project Structure',
				href: '/docs/getting-started/project-structure'
			},
			{
				title: 'Environment Variables',
				href: '/docs/getting-started/environment-variables'
			},
			{
				title: 'BaseAI CLI',
				href: '/docs/getting-started/cli'
			},
			{
				title: 'Config',
				href: '/docs/getting-started/config'
			},
			{
				title: 'Logs',
				href: '/docs/getting-started/logs'
			}
		]
	},
	{
		title: 'pipe',
		isCommand: true,
		links: [
			{
				title: 'Quickstart',
				href: '/docs/pipe/quickstart'
			},
			{
				title: 'Concepts',
				href: '/docs/pipe/concepts'
			},
			{
				title: 'FAQs',
				href: '/docs/pipe/faqs'
			}
		]
	},
	{
		title: 'memory',
		isCommand: true,
		links: [
			{
				title: 'Quickstart',
				href: '/docs/memory/quickstart'
			},
			{
				title: 'Create',
				href: '/docs/memory/create'
			},
			{
				title: 'Embed Memory',
				href: '/docs/memory/embed'
			},
			{
				title: 'Embed Documnet',
				href: '/docs/memory/embed-document'
			},
			{
				title: 'List',
				href: '/docs/memory/list'
			},
			{
				title: 'Retrieve',
				href: '/docs/memory/retrieve'
			},
			{
				title: 'Ollama Embeddings',
				href: '/docs/memory/ollama-embeddings'
			},
			{
				title: 'FAQs',
				href: '/docs/memory/faqs'
			}
		]
	},
	{
		title: 'tool',
		isCommand: true,
		links: [
			{
				title: 'Quickstart',
				href: '/docs/tools/quickstart'
			},
			{
				title: 'Create',
				href: '/docs/tools/create'
			},
			{
				title: 'FAQs',
				href: '/docs/tools/faqs'
			}
		]
	},
	{
		title: 'add',
		isCommand: true,
		links: [
			{
				title: 'Quickstart',
				href: '/docs/add/quickstart'
			},
			{
				title: 'FAQs',
				href: '/docs/add/faqs'
			}
		]
	},
	{
		title: 'deploy',
		isCommand: true,
		links: [
			{
				title: 'Authentication',
				href: '/docs/deployment/authentication'
			},
			{
				title: 'Deploy',
				href: '/docs/deployment/deploy'
			}
		]
	},
	{
		title: 'API Reference',
		links: [
			{
				title: 'pipe.run()',
				href: '/docs/api-reference/pipe-run'
			},
			{
				title: 'getRunner()',
				href: '/docs/api-reference/get-runner'
			},
			// {
			// 	title: 'generateText()',
			// 	href: '/docs/api-reference/generate-text'
			// },
			// {
			// 	title: 'streamText()',
			// 	href: '/docs/api-reference/stream-text'
			// },
			{
				title: 'usePipe()',
				href: '/docs/api-reference/use-pipe'
			}
		]
	},
	{
		title: 'Guides',
		links: [
			{
				title: 'Using Ollama Models',
				href: '/docs/guides/using-ollama-models'
			},
			{
				title: 'RAG with Ollama Embeddings',
				href: '/docs/guides/using-ollama-embeddings'
			},
			{
				title: 'Build Next.js App with BaseAI',
				href: '/docs/guides/nextjs-with-baseai'
			}
		]
	}
];

export const navLearn: NavigationItem[] = [
	{
		title: 'Learn',
		links: [
			{
				title: 'Getting started',
				href: '/learn'
			}
		]
	},
	{
		title: 'pipe',
		isCommand: true,
		links: [
			{
				title: 'Create a summarizer pipe',
				href: '/learn/create-pipe'
			},
			{
				title: 'Configure summarizer pipe',
				href: '/learn/configure-pipe'
			},
			{
				title: 'Integrate pipe in Node.js',
				href: '/learn/integrate-pipe'
			},
			{
				title: 'Run pipe locally',
				href: '/learn/run-pipe'
			}
		]
	},
	{
		title: 'tool',
		isCommand: true,
		links: [
			{
				title: 'Create a weather tool',
				href: '/learn/create-tool'
			},
			{
				title: 'Configure weather tool',
				href: '/learn/configure-tool'
			},
			{
				title: 'Integrate tool in pipe',
				href: '/learn/integrate-tool-in-pipe'
			},
			{
				title: 'Run pipe with weather tool',
				href: '/learn/run-pipe-with-tool'
			}
		]
	},
	{
		title: 'memory',
		isCommand: true,
		links: [
			{
				title: 'Create a memory',
				href: '/learn/create-memory'
			},
			{
				title: 'Add documents to memory',
				href: '/learn/add-docs-to-memory'
			},
			{
				title: 'Create memory embeddings',
				href: '/learn/create-memory-embeddings'
			},
			{
				title: 'Integrate memory in pipe',
				href: '/learn/integrate-memory-in-pipe'
			},
			{
				title: 'Run pipe with memory',
				href: '/learn/run-pipe-with-memory'
			}
		]
	},
	{
		title: 'deploy',
		isCommand: true,
		links: [
			{
				title: 'Deploy pipe, tool, and memory',
				href: '/learn/deploy-rag-on-langbase'
			}
		]
	},
	{
		title: 'Documentation',
		links: [
			{
				title: 'Read the docs',
				href: '/docs'
			}
		]
	}
];

export default navigationData;
