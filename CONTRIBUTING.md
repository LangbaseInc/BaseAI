# Contributing

We welcome contributions to this project.

---

## Releasing a new version

```bash
pnpm changeset
pnpm version-packages && grlz 'new version'
pnpm release
```
## Testing locally

To test the changes locally, you can run the following command:

- Use an example like the Next.js one
- Change the `package.json` to point to the local package for `baseai` and `@baseai/core` packages.

```json
{
  "dependencies": {
    "@baseai/core": "workspace:*"
  },
    "devDependencies": {
        "baseai": "workspace:*"
    }
}
```

Now run in the root `pnpm clean-all && pnpm install` and then run `pnpm dev` to start the development server.

By doing this, the Next.js app will use the local packages instead of the published ones.

---

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
