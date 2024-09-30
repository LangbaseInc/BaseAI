# `langbase` SDK

## 0.9.0

### Minor Changes

-   📦 NEW: ready for prod

## 0.0.29

### Patch Changes

-   📖 DOC: readme

## 0.0.28

### Patch Changes

-   👌 IMPROVE: defaults

## 0.0.27

### Patch Changes

-   🐛 FIX: config import

## 0.0.26

### Patch Changes

-   👌 IMPROVE: deploy summary

## 0.0.25

### Patch Changes

-   👌 IMPROVE: deployment summary

## 0.0.24

### Patch Changes

-   📦 NEW: deploy summary

## 0.0.23

### Patch Changes

-   👌 IMPROVE: internal lingo

## 0.0.22

### Patch Changes

-   📦 NEW: example env file

## 0.0.21

### Patch Changes

-   📦 NEW: key name

## 0.0.20

### Patch Changes

-   📦 NEW: .baseai now lives in the root dir and git ignored

## 0.0.19

### Patch Changes

-   🐛 FIX: git ignore command

## 0.0.18

### Patch Changes

-   📦 NEW: ignore build files

## 0.0.17

### Patch Changes

-   📦 NEW: API key name for langbase in pipe

## 0.0.16

### Patch Changes

-   📦 NEW: memory overrite when deploying

## 0.0.15

### Patch Changes

-   🐛 FIX: types and no ts basePath

## 0.0.14

### Patch Changes

-   🐛 FIX: types of ChunkStream

## 0.0.13

### Patch Changes

-   🐛 FIX: prodOptions name of a pipe for user/org key access

## 0.0.12

### Patch Changes

-   🐛 FIX: remove dotenv from @baseai/core

## 0.0.11

### Patch Changes

-   👌 IMPROVE: extra env var typo

## 0.0.10

### Patch Changes

-   👌 IMPROVE: Lingo

## 0.0.9

### Patch Changes

-   🐛 FIX: pkg json path

## 0.0.8

### Patch Changes

-   🐛 FIX: @baseai/core types

## 0.0.7

### Patch Changes

-   🐛 FIX: exports

## 0.0.6

### Patch Changes

-   🐛 FIX: Types and peer deps

## 0.0.5

### Patch Changes

-   🐛 FIX: Extra log

## 0.0.4

### Patch Changes

-   🐛 FIX: logs

## 0.0.3

### Patch Changes

-   🐛 FIX: init order and config loader

## 0.0.2

### Patch Changes

-   Initial release

## 1.1.0

### Minor Changes

-   Export all pipe helper functions

## 1.0.0

### Major Changes

-   📦 NEW: Chat support in both both [`generateText()`](https://langbase.com/docs/langbase-sdk/generate-text) and [`streamText()`](https://langbase.com/docs/langbase-sdk/stream-text)
-   👌 IMPROVE: Example updates for Node, browser, Next.js, React, etc.
-   👌 IMPROVE: ⌘ Langbase [SDK Docs](https://langbase.com/docs/langbase-sdk) and API reference for both [`generateText()`](https://langbase.com/docs/langbase-sdk/generate-text) and [`streamText()`](https://langbase.com/docs/langbase-sdk/stream-text)
-   ‼️ BREAKING: `ChoiceNonStream` type is now renamed to `ChoiceGenerate`.
-   ‼️ BREAKING: [`generateText()`](https://langbase.com/docs/langbase-sdk/generate-text) now doesn't return raw instead all properties are included in the main response.

    #### BEFORE

    ```ts
    interface GenerateNonStreamResponse {
    	completion: string;
    	raw: {
    		id: string;
    		object: string;
    		created: number;
    		model: string;
    		choices: ChoiceNonStream[];
    		usage: Usage;
    		system_fingerprint: string | null;
    	};
    }
    ```

    #### NOW

    ```ts
    interface GenerateResponse {
    	completion: string;
    	threadId?: string;
    	id: string;
    	object: string;
    	created: number;
    	model: string;
    	system_fingerprint: string | null;
    	choices: ChoiceGenerate[];
    	usage: Usage;
    }
    ```

-   ‼️ BREAKING: [`streamText()`](https://langbase.com/docs/langbase-sdk/stream-text) now returns a threadId and stream as an object instead of returning stream alone.

    #### BEFORE

    ```ts
    const stream = await pipe.streamText({
    	messages: [{role: 'user', content: 'Who is an AI Engineer?'}],
    });
    ```

    #### NOW

    ```ts
    const {threadId, stream} = await pipe.streamText({
    	messages: [{role: 'user', content: 'Who is an AI Engineer?'}],
    });
    ```

## 0.6.0

### Minor Changes

-   Support variables

## 0.5.0

### Minor Changes

-   Switch off the stream in generateText()

## 0.4.0

### Minor Changes

-   📦 NEW: TypeScript types in Stream Delta for tool calls

## 0.3.0

### Minor Changes

-   📦 NEW: Tool calls TypeScript types

## 0.2.5

### Patch Changes

-   📖 DOC: Example and docs link

## 0.2.4

### Patch Changes

-   📖 DOC: readme and docs update

## 0.2.3

### Patch Changes

-   👌 IMPROVE: TypeScript Types and examples

## 0.2.2

### Patch Changes

-   👌 IMPROVE: Readme docs and lingo

## 0.2.1

### Patch Changes

-   Readme with examples and docs link

## 0.2.0

### Minor Changes

-   139e314: export browser readable stream method `fromReadableStream()`

## 0.1.0

### Minor Changes

-   b026a61: Initial beta release

## 0.0.1

### Patch Changes

-   Initial package. Let's do this IA.
