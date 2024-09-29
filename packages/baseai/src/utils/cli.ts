import meowHelp from 'cli-meow-help';
import meow from 'meow';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		desc: `Clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		shortFlag: `d`,
		desc: `Print debug info`
	},
	memory: {
		type: `string`,
		shortFlag: `m`,
		desc: `Memory to use` // For embed as well as retrieve
	},
	overwrite: {
		type: `boolean`,
		shortFlag: `o`,
		desc: `Overwrite existing memory embeddings`
	},
	document: {
		type: `string`,
		shortFlag: `d`,
		desc: `Document to embed` // For embedding a single document.
	},
	query: {
		type: `string`,
		shortFlag: `q`,
		desc: `Query string`
	},
	list: {
		type: `boolean`,
		shortFlag: `l`,
		desc: `List available memory`
	},
	local: {
		type: `boolean`,
		shortFlag: `L`,
		desc: `Set use local embeddings (true/false)`
	}
};

const commands = {
	dev: { desc: `Run BaseAI in dev mode` },
	auth: { desc: `Authenticate with Langbase` },
	add: { desc: `Add an agent Pipe from Langbase` },
	deploy: { desc: `Deploy BaseAI to Langbase` },
	pipe: { desc: `Create a pipe` },
	tool: { desc: `Create a tool` },
	memory: { desc: `Create a memory` },
	embed: { desc: `Create embeddings of a memory` },
	retrieve: { desc: `Retrieve similar chunks of a memory` },
	config: {
		desc: `Configure BaseAI`,
		subcommands: {
			embeddings: {
				desc: `Enable or disable local embeddings`
			}
		}
	},
	build: { desc: `Build BaseAI files` },
	init: { desc: `Set up BaseAI files and add packages` },
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `baseai`,
	flags,
	commands,
	desc: false,
	header: false,
	footer: `Made by Langbase. For more https://langbase.com/docs`
});

const options = {
	importMeta: import.meta,
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
