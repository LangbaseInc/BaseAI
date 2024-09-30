# BaseAI Node.js Examples

BaseAI Node.js examples.

Please read the [documentation](https://baseai.dev/docs) for more information.

```sh
# Install the dependencies
npm install

# Make sure to copy .env.baseai.example file and
# create .env file and add all the API keys in it
cp .env.baseai.example .env

# Run the local baseai dev server to test the examples (uses localhost:9000 port)
npx baseai dev

# Add `pipe` or `tool` or `memory`
npx baseai pipe

# Then test any of the files or a script which runs these files.
npm run pipe.run
npm run pipe.run.stream
npm run pipe.run.stream.loop
npm run pipe.generate.text
npm run pipe.stream.text
```

For more questions, please reach out to us on our new [Discord community](https://langbase.com/discord) or [𝕏/Twitter](https://twitter.com/langbaseinc).
