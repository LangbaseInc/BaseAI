# Contributing

We welcome contributions to this project.

## Releasing a new version

```bash
pnpm changeset
pnpm version-packages && grlz 'new version'
pnpm release
```

## Docs

Docs are written in markdown and are present inside the `apps/baseai.dev/content/docs` directory.

The docs in `content/docs` are categorized into sections. Each section is a directory and each page is a markdown file inside the directory.

To add a new page in a section, create a new markdown file inside the section directory.

1. The file name should be in kebab case.
2. The file should have a frontmatter with the following fields:

```mdx
---
title: "<REPLACE-WITH-TITLE>"
description: "<REPLACE-WITH-DESCRIPTION>"
tags:
    - <REPLACE-WITH-TAGS>
    - <REPLACE-WITH-TAGS>
section: "<REPLACE-WITH-SECTION>"
published: 2024-09-24
modified: 2024-09-24
---
```

The following is an example of a frontmatter:

```mdx
---
title: "BaseAI CLI"
description: "CLI reference of BaseAI CLI."
tags:
    - baseai
    - cli
    - langbase
section: "Getting Started"
published: 2024-09-24
modified: 2024-09-24
---
```
