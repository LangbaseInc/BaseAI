import langGraphQL from 'shiki/languages/graphql.tmLanguage.json' assert { type: 'json' };
import langJS from 'shiki/languages/javascript.tmLanguage.json' assert { type: 'json' };
import langJSX from 'shiki/languages/jsx.tmLanguage.json' assert { type: 'json' };
import langJSON from 'shiki/languages/json.tmLanguage.json' assert { type: 'json' };
import langXML from 'shiki/languages/xml.tmLanguage.json' assert { type: 'json' };
import langYAML from 'shiki/languages/yaml.tmLanguage.json' assert { type: 'json' };
import langPHP from 'shiki/languages/php.tmLanguage.json' assert { type: 'json' };
import langHTML from 'shiki/languages/html.tmLanguage.json' assert { type: 'json' };
import langCSS from 'shiki/languages/css.tmLanguage.json' assert { type: 'json' };
import langSCSS from 'shiki/languages/scss.tmLanguage.json' assert { type: 'json' };
import langSASS from 'shiki/languages/sass.tmLanguage.json' assert { type: 'json' };
import langLESS from 'shiki/languages/less.tmLanguage.json' assert { type: 'json' };
import langMarkdown from 'shiki/languages/markdown.tmLanguage.json' assert { type: 'json' };
import langTS from 'shiki/languages/typescript.tmLanguage.json' assert { type: 'json' };
import langTSX from 'shiki/languages/tsx.tmLanguage.json' assert { type: 'json' };
import langShell from 'shiki/languages/shellscript.tmLanguage.json' assert { type: 'json' };
import langPy from 'shiki/languages/python.tmLanguage.json' assert { type: 'json' };

const lang = [
	{
		id: 'js',
		scopeName: langJS.scopeName,
		grammar: langJS,
		aliases: ['js']
	},
	{
		id: 'jsx',
		scopeName: langJSX.scopeName,
		grammar: langJSX,
		aliases: ['jsx']
	},
	{
		id: 'json',
		scopeName: langJSON.scopeName,
		grammar: langJSON,
		aliases: ['json']
	},
	{
		id: 'graphql',
		scopeName: langGraphQL.scopeName,
		grammar: langGraphQL,
		aliases: ['graphql']
	},
	{
		id: 'xml',
		scopeName: langXML.scopeName,
		grammar: langXML,
		aliases: ['xml']
	},
	{
		id: 'yaml',
		scopeName: langYAML.scopeName,
		grammar: langYAML,
		aliases: ['yaml']
	},
	{
		id: 'php',
		scopeName: langPHP.scopeName,
		grammar: langPHP,
		aliases: ['php']
	},
	{
		id: 'html',
		scopeName: langHTML.scopeName,
		grammar: langHTML,
		aliases: ['html']
	},
	{
		id: 'css',
		scopeName: langCSS.scopeName,
		grammar: langCSS,
		aliases: ['css']
	},
	{
		id: 'scss',
		scopeName: langSCSS.scopeName,
		grammar: langSCSS,
		aliases: ['scss']
	},
	{
		id: 'sass',
		scopeName: langSASS.scopeName,
		grammar: langSASS,
		aliases: ['sass']
	},
	{
		id: 'less',
		scopeName: langLESS.scopeName,
		grammar: langLESS,
		aliases: ['less']
	},
	{
		id: 'markdown',
		scopeName: langMarkdown.scopeName,
		grammar: langMarkdown,
		aliases: ['markdown']
	},
	{
		id: 'ts',
		scopeName: langTS.scopeName,
		grammar: langTS,
		aliases: ['ts']
	},
	{
		id: 'tsx',
		scopeName: langTSX.scopeName,
		grammar: langTSX,
		aliases: ['tsx']
	},
	{
		id: 'shell',
		scopeName: langShell.scopeName,
		grammar: langShell,
		aliases: ['shell', 'bash']
	},
	{
		id: 'py',
		scopeName: langPy.scopeName,
		grammar: langPy,
		aliases: ['py', 'python']
	}
];

export default lang;
