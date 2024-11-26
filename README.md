<p align="center">
  <a href="https://baseai.dev">
      <img src="https://github.com/user-attachments/assets/6d447930-e347-4ce3-908f-0d6d676c517e">
    <h1 align="center">BaseAI</h1>
  </a>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/baseai"><img alt="" src="https://img.shields.io/npm/v/@baseai/core?style=for-the-badge&logo=https%3A%2F%2Fraw.githubusercontent.com%2FLangbaseInc%2Fdocs-images%2Frefs%2Fheads%2Fmain%2Fbaseai%2Fbaseai-icon.png&logoColor=%23000&labelColor=%23000&color=%2318181B"></a>
  <a aria-label="License" href="https://github.com/langbaseinc/baseai"><img alt="license" src="https://img.shields.io/npm/l/@baseai/core?style=for-the-badge&logoColor=%23000&labelColor=%23000&color=%2318181B"></a>
</p>

## Getting Started

BaseAI is the AI framework for building serverless and composable AI agents with memory and tools. It allows you to develop AI agent pipes on your local machine with integrated agentic tools and memory (RAG). Visit our [BaseAI.dev/learn](https://baseai.dev/learn) guide to start with BaseAI.

### Documentation (recommended)

Please check [BaseAI.dev/docs](https://baseai.dev/docs) and [BaseAI.dev/learn](https://baseai.dev/learn) to get started with full documentation.


### 1. Initialize a new BaseAI project

BaseAI is a TypeScript-first framework. To create a new BaseAI project, run the following command in your project:

```bash
npx baseai@latest init
```

This command will create a `baseai` directory in your project. This is what the directory structure looks like:

```
ROOT (of your app)
├── baseai
|  ├── baseai.config.ts
|  ├── memory
|  ├── pipes
|  └── tools
├── .env (your env file)
└── package.json
```

### 2. Add API keys

Copy the following in your  `.env` file and add appropriate LLM API keys:

```bash
# !! SERVER SIDE ONLY !!
# Keep all your API keys secret — use only on the server side.

# TODO: ADD: Both in your production and local env files.
# Langbase API key for your User or Org account.
# How to get this API key https://langbase.com/docs/api-reference/api-keys
LANGBASE_API_KEY=

# TODO: ADD: LOCAL ONLY. Add only to local env files.
# Following keys are needed for local pipe runs. For providers you are using.
# For Langbase, please add the key to your LLM keysets.
# Read more: Langbase LLM Keysets https://langbase.com/docs/features/keysets
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
COHERE_API_KEY=
FIREWORKS_API_KEY=
GOOGLE_API_KEY=
GROQ_API_KEY=
MISTRAL_API_KEY=
PERPLEXITY_API_KEY=
TOGETHER_API_KEY=
XAI_API_KEY=
```

### 3. Create a new AI agent

Pipe is your custom-built AI agent as an API. It's the fastest way to ship AI features/apps. Let's create a new pipe:

```bash
npx baseai@latest pipe
```

It will ask you for the name, description, and other details of the pipe step-by-step. Once done, a pipe will be created inside the `/baseai/pipes` directory. You can now edit the system prompt, change model params, and more. Here is what a pipe code looks like:

```ts
import { PipeI } from '@baseai/core';

const pipeSummary = (): PipeI => ({
	// Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
	name: 'summary',
	description: 'AI Summary agent',
	status: 'public',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content: `You are a helpful AI agent. Make everything Less wordy.`
		}
	],
	variables: [],
	memory: [],
	tools: []
});

export default pipeSummary;
```

### 4. Integrate pipe in your app

Let's create a new `index.ts` file in your project root. Now we need to do the following:

1. Import the pipe config we created.
2. Create a new pipe instance with the pipe config.
3. Run the pipe with a user message.
4. Listen to the stream events.

Here is what the code looks like:

```ts
import { Pipe, getRunner } from '@baseai/core';
import pipeSummarizer from './baseai/pipes/summary';

const pipe = new Pipe(pipeSummarizer());

const userMsg = `
Langbase studio is your playground to build, collaborate, and deploy AI. It allows you to experiment with your pipes in real-time, with real data, store messages, version your prompts, and truly helps you take your idea from building prototypes to deployed in production with LLMOps on usage, cost, and quality.
A complete AI developers platform.
- Collaborate: Invite all team members to collaborate on the pipe. Build AI together.
- Developers & Stakeholders: All your R&D team, engineering, product, GTM (marketing and sales), literally invlove every stakeholder can collaborate on the same pipe. It's like a powerful version of GitHub x Google Docs for AI. A complete AI developers platform.
`;

async function main() {
	const { stream } = await pipe.run({
		messages: [{ role: 'user', content: userMsg }],
		stream: true,
	});

	const runner = getRunner(stream);

	// Method 1: Using event listeners
	runner.on('connect', () => {
		console.log('Stream started.\n');
	});

	runner.on('content', content => {
		process.stdout.write(content);
	});

	runner.on('end', () => {
		console.log('\nStream ended.');
	});

	runner.on('error', error => {
		console.error('Error:', error);
	});
}

main();
```

Make sure to install and import `dotenv` at the top if you are using Node.js:

```ts
import 'dotenv/config';
```

### 5. Run the AI agent

To run the pipe locally, you need to start the BaseAI server. Run the following command in your terminal:

```bash
npx baseai@latest dev
```

Now, run the `index.ts` file in your terminal:

```bash
npx tsx index.ts
```

You should see the following output in your terminal:

```md
Stream started.

Langbase Studio is your AI development playground. Experiment in real-time with real data, store messages, and version prompts to move from prototype to production seamlessly.

Key Features:
- **Collaborate**: Invite team members to build AI together.
- **Inclusive Teams**: Engage all stakeholders—R&D, engineering, product, and marketing—in a shared space. It’s like GitHub combined with Google Docs for AI development.
Stream ended.
```
> [!TIP]
> You can also run RAG locally with BaseAI. Check out the memory agent quickstart [guide](https://baseai.dev/docs/memory/quickstart) for more details.

## Contributing

We welcome contributions to BaseAI. Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## Authors

The following are the original authors of BaseAI:

- Ahmad Awais ([@MrAhmadAwais](https://twitter.com/MrAhmadAwais))
- Ashar Irfan ([@MrAsharIrfan](https://twitter.com/MrAsharIrfan))
- Saqib Ameen ([@SaqibAmeen](https://twitter.com/SaqibAmeen))
- Saad Irfan ([@MrSaadIrfan](https://twitter.com/MrSaadIrfan))
- Ahmad Bilal ([@AhmadBilalDev](https://twitter.com/ahmadbilaldev))

## Security

If you've found a security vulnerability in BaseAI, please report it privately by emailing [security@langbase.com](mailto:security@langbase.com). Please do not open a public issue. For more details on Langbase security and how to report, visit this [link](https://langbase.com/security).

Learn more by clicking and browsing our [website][bai], [docs][baid], and a free [/learn AI course][bail] on building AI agents, with agentic tools, and agentic memory.

[![baseai.dev](https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-ogg.jpg)][bai]

[bai]: https://baseai.dev
[baid]: https://baseai.dev/docs
[bail]: https://baseai.dev/learn
