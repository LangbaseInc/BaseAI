![IT Systems Triage Agent by ⌘ BaseAI][cover]

![License: MIT][mit] [![Fork on ⌘ Langbase][fork]][pipe]

## Build an IT Systems Triage Agent with BaseAI framework — ⌘ Langbase

This **IT Triage Agent** is designed to streamline the resolution process by assigning issue priority and category based on a user’s description of their IT system problem. Built as a CLI application, it relies on a BaseAI pipe call and features a central entry point in `index.ts`. Additionally, the logging is configured to be switched off by default in the `baseai.config.ts` file.

This AI Agent is built using the BaseAI framework. It leverages an agentic pipe that integrates over 30+ LLMs (including OpenAI, Gemini, Mistral, Llama, Gemma, etc.) and can handle any data, with context sizes of up to 10M+ tokens, supported by memory. The framework is compatible with any front-end framework (such as React, Remix, Astro, Next.js), giving you, as a developer, the freedom to tailor your AI application exactly as you envision.

## How to use

Navigate to `examples/agents/it-systems-triage-agent` and run the following commands:

```sh
# Navigate to baseai/examples/agents/it-systems-triage-agent
cd examples/agents/it-systems-triage-agent

# Install the dependencies
npm install

# Make sure to copy .env.baseai.example file and
# create .env file and add all the relevant API keys in it
cp .env.baseai.example .env

# Run the local baseai dev server to test the examples (uses localhost:9000 port)
npx baseai dev

# Run the agent
tsx index.ts
```

## Features

- IT Systems Triage Agent — Built with [BaseAI framework and agentic Pipe ⌘ ][qs].
- Composable Agents — build and compose agents with BaseAI.
- Add and Sync deployed pipe on Langbase locally npx baseai@latest add ([see the Code button][pipe]).

## Learn more

1. Check the [Learning path to build an agentic AI pipe with ⌘ BaseAI][learn]
2. Read the [source code on GitHub][gh] for this agent example
3. Go through Documentaion: [Pipe Quick Start][qs]
4. Learn more about [Memory features in ⌘ BaseAI][memory]
5. Learn more about [Tool calls support in ⌘ BaseAI][toolcalls]


> NOTE:
> This is a BaseAI project, you can deploy BaseAI pipes, memory and tool calls on Langbase.

---

## Authors

This project is created by [Langbase][lb] team members, with contributions from:

- Muhammad-Ali Danish - Software Engineer, [Langbase][lb] <br>
**_Built by ⌘ [Langbase.com][lb] — Ship hyper-personalized AI assistants with memory!_**

[lb]: https://langbase.com
[pipe]: https://langbase.com/examples/it-systems-triage-agent
[gh]: https://github.com/LangbaseInc/baseai/tree/main/examples/agents/it-systems-triage-agent
[cover]:https://raw.githubusercontent.com/LangbaseInc/docs-images/main/baseai/baseai-cover.png
[download]:https://download-directory.github.io/?url=https://github.com/LangbaseInc/baseai/tree/main/examples/it-systems-triage-agent
[learn]:https://baseai.dev/learn
[memory]:https://baseai.dev/docs/memory/quickstart
[toolcalls]:https://baseai.dev/docs/tools/quickstart
[deploy]:https://baseai.dev/docs/deployment/authentication
[signup]: https://langbase.fyi/io
[qs]:https://baseai.dev/docs/pipe/quickstart
[docs]:https://baseai.dev/docs
[xaa]:https://x.com/MrAhmadAwais
[xab]:https://x.com/AhmadBilalDev
[local]:http://localhost:9000
[mit]: https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=%23000000
[fork]: https://img.shields.io/badge/FORK%20ON-%E2%8C%98%20Langbase-000000.svg?style=for-the-badge&logo=%E2%8C%98%20Langbase&logoColor=000000
