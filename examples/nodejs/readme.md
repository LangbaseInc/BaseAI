# Node.js Examples

BaseAI Node.js examples for the Pipe API.

```sh
# Make sure to copy .env.example file and create .env file and add all the API keys in it
cp .env.example .env

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
