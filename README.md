<p align="center">
  <a href="https://baseai.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-cover.png">
      <img src="https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-cover.png">
    </picture>
    <h1 align="center">BaseAI</h1>
  </a>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/baseai"><img alt="" src="https://img.shields.io/npm/v/baseai?style=for-the-badge&logo=https%3A%2F%2Fraw.githubusercontent.com%2FLangbaseInc%2Fdocs-images%2Frefs%2Fheads%2Fmain%2Fbaseai%2Fbaseai-icon.png&logoColor=%23000&labelColor=%23000&color=%2318181B"></a>
  <a aria-label="License" href="https://github.com/langbaseinc/baseai"><img alt="license" src="https://img.shields.io/npm/l/baseai?style=for-the-badge&logoColor=%23000&labelColor=%23000&color=%2318181B"></a>
</p>

## Getting Started

BaseAI is the AI framework for building declarative and composable AI-powered LLM products. It allows you to locally develop AI agents integrated with tools and memory (RAG). Visit our [learn](https://baseai.dev/docs/learn/build-ai-pipe-with-tools-and-memory) guide to get started with BaseAI.

## Documentation

Visit [baseai.dev/docs](https://baseai.dev/docs) for the full documentation.

## Contributing

We welcome contributions to BaseAI. Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## Authors

The following are the original authors of BaseAI:

- Ahmad Awais ([@MrAhmadAwais](https://twitter.com/MrAhmadAwais))
- Ashar Irfan ([@MrAsharIrfan](https://twitter.com/MrAsharIrfan))
- Saqib Ameen ([@SaqibAmeen](https://twitter.com/SaqibAmeen))
- Saad Irfan ([@MrSaadIrfan](https://twitter.com/MrSaadIrfan))
- Ahmad Bilal ([@AhmadBilalDev](https://twitter.com/ahmadbilaldev))

## Local Development

```bash
# To install a new node module cd into pkg and pnpm install XYZ in it
# Terminal 1
# Root
pnpm install

# For our dev. Compiling and watching for changes. Run all packages in dev mode.
pnpm dev:pkgs

# Nextjs dev
cd examples/nextjs
pnpm dev

# BaseAI dev inside nextjs
cd examples/nextjs
npx baseai dev

# Add pipe
cd examples/nextjs
npx baseai pipe


# Global link.
# pnpm link --global

# Terminal 2
# Root — runs `baseai dev` live from the local package so all updates are auto loaded.
# pnpm baseai:dev

# Testing
# npx tsx ./packages/testing/index.ts

# Issues? Reset.
# if errors then go to root
pnpm -g rm baseai
pnpm clean-all
pnpm install
pnpm build:pkgs
pnpm install

# now back to step 1
```

## Creating Memory and Using it in a Pipe

0.  Set `OPENAI_API_KEY` for your testing script.

1.  Create a new memory
    `baseai memory`

        → It will give you a url where you can paste your documents.

2.  Paste documents to the directory it gives.

3.  Embed it using:

    `baseai embed --memory="<MEMORY_NAME_FROM_STEP_1>"`

4.  Attach to a pipe

    Use `baseai pipe` to create a pipe, and when it prompts you to select memory, select the memory that you just created.

5.  Run your testing script
    Ask a question from your files.

## Memory Retrieval

0. Make sure you have a memory created and embedded.

1. Use `baseai memory --list` to see all the memory.

2. Use `baseai retrieve --memory="<MEMORY_NAME>" --query="<YOUR_QUERY>"` to retrieve similar chunks.

Up-to maximum of 20 chunks will be returned.

## List Memory

`baseai memory --list` to list all the available memory.

## Deploy

`baseai deploy` to deploy everything to Langbase.

> [!NOTE]
> Memory deploy is in beta currently. It support following features:
> 1. If memory is not present in Langbase, it will create a new memory.
> 2. If memory is present in Langbase, it will compare the documents.
>    - If documents are same, it will skip the memory.
>    - If documents in prod are subset of local, it will upload the new documents.
>    - If documents in prod are superset of local, it will ask for override permission.

If you want to use memory deployment uncomment out L53-58 in `baseai/src/deploy/index.ts`.

## Use a local model using Ollama

Follow these steps to use a local model using Ollama in BaseAI:

1. Install Ollama

Follow the instructions in the [Ollama repository](https://github.com/ollama/ollama/blob/main/README.md) to install Ollama.

2. Run a local model using Ollama. For example, let's run the small `tinyllama` model:

```bash
ollama run tinyllama

# or even small 6MB model
ollama run ben1t0/tiny-llm
```

1. Add the model to your pipe configuration file.

```bash
...
model: 'ollama:tinyllama',

# Or
model: 'ollama:ben1t0/tiny-llm',
...
```

Run the pipe and you should see the output from the local Ollama model.

> [!NOTE]
> BaseAI uses the default local url `http://localhost:11434` to connect to the Ollama model. Make sure the Ollama model is running on this url.

## Logger

The logging system in BaseAI allows for flexible and hierarchical control over log output. To log a message, use the `log` function from `loggerUtils`.

### Usage

The `log` function takes three arguments:

```ts
logger(category: LogCategories, value: unknown, logHeader?: string)
```

- `category`: The category of the log message. It uses a dot-notation to represent hierarchy.
- `value`: The value to be logged.
- `logHeader` (optional): A header for the log message.

Example usage:

```ts
import { log } from './loggerUtils';

logger('pipe.request.body', requestBody, 'Request Body');
logger('pipe.response.status', responseStatus, 'Response Status');
```

### Log Config Options

Find default configuration in `packages/baseai/src/config/config-handler.ts`. Here is what it looks like:

```ts
export const defaultConfig: BaseAIConfig = {
	log: {
		// Enable or disable logging
		isEnabled: true,
		// Log sensitive data
		logSensitiveData: false,
		// Toggle specific log categories
		pipe: true,
		'pipe.completion': true,
		'pipe.request': true,
		'pipe.response': true,
		tool: false,
		memory: false
	}
	// Other default configuration options can be added here
};
```

- `isEnabled`: Master switch to enable/disable all logging.
- `logSensitiveData`: Controls whether sensitive data should be logged.
- Category toggles: Use dot-notation to enable/disable specific categories and subcategories.

### Hierarchical Categories

The logging system supports hierarchical categories. This means:

1. If a parent category is set to `false`, all its subcategories will be disabled, regardless of their individual settings.
2. If a parent category is not specified or set to `true`, subcategories can be individually controlled.

For example:

- If `pipe: false`, all `pipe.*` logs will be disabled.
- If `pipe: true` and `pipe.request: false`, all `pipe.request.*` logs will be disabled, but `pipe.response.*` logs will still be active (if not explicitly disabled).

You can add more categories as needed in your configuration. To add a new category, add it in the `config.ts` interface in both `baseai` and `core` packages. Update the default config in `config-handler.ts` if required.

## Config

The `baseai.config.ts` file contains the configuration for BaseAI for the logger. It resides in the `baseai` folder of your project.

To add new config options you can modify the `defaultConfig` object in the `config-handler.ts` file in the `baseai` package. For config types, modify the `types/config.ts` interfaces in baseai and core packages.

Config updates are not hot-reloaded currently. You need to restart the server to apply changes.
