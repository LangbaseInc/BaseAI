import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const langGraphQL = require('shiki/languages/graphql.tmLanguage.json');
const langJS = require('shiki/languages/javascript.tmLanguage.json');
const langJSX = require('shiki/languages/jsx.tmLanguage.json');
const langJSON = require('shiki/languages/json.tmLanguage.json');
const langXML = require('shiki/languages/xml.tmLanguage.json');
const langYAML = require('shiki/languages/yaml.tmLanguage.json');
const langPHP = require('shiki/languages/php.tmLanguage.json');
const langHTML = require('shiki/languages/html.tmLanguage.json');
const langCSS = require('shiki/languages/css.tmLanguage.json');
const langSCSS = require('shiki/languages/scss.tmLanguage.json');
const langSASS = require('shiki/languages/sass.tmLanguage.json');
const langLESS = require('shiki/languages/less.tmLanguage.json');
const langMarkdown = require('shiki/languages/markdown.tmLanguage.json');
const langTS = require('shiki/languages/typescript.tmLanguage.json');
const langTSX = require('shiki/languages/tsx.tmLanguage.json');
const langShell = require('shiki/languages/shellscript.tmLanguage.json');
const langPy = require('shiki/languages/python.tmLanguage.json');

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
