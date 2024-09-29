const fs = require('node:fs');
const matter = require('gray-matter');

const BASE_URL = 'https://baseai.dev';
const CONTENT_BASE_URL = `${process.cwd()}/content`;
const DOCS_BASE_URL = `${CONTENT_BASE_URL}/docs`;
const LEARN_BASE_URL = `${CONTENT_BASE_URL}/learn`;
const APPS = ['docs', 'learn'];

/**
 * Formats a section string by replacing hyphens with spaces and capitalizing the first letter of each word.
 *
 * @param section - The section string to format.
 * @returns The formatted section string.
 */
async function formatString(section) {
	if (!section) return '';
	return section
		.replace(/-/g, ' ')
		.replace(/\b\w/g, char => char.toUpperCase());
}

async function fetchMDXContent({ slug, section, dirPath, baseUrl }) {
	const { serialize } = await import('next-mdx-remote/serialize');
	const { recmaPlugins } = await import('../mdx/recma.mjs');
	const { rehypePlugins } = await import('../mdx/rehype.mjs');
	const { remarkPlugins } = await import('../mdx/remark.mjs');

	const markdownWithMeta = section
		? fs.readFileSync(`${dirPath}/${section}/${slug}.mdx`, 'utf-8')
		: fs.readFileSync(`${dirPath}/${slug}.mdx`, 'utf-8');

	const { data: frontmatter, content } = matter(markdownWithMeta);
	const mdxSource = await serialize(content, {
		mdxOptions: {
			recmaPlugins: [...recmaPlugins],
			rehypePlugins: [...rehypePlugins],
			remarkPlugins: [...remarkPlugins]
		}
	});

	const docsSection = await formatString(section);
	let title = `${frontmatter.title}`;
	let url = baseUrl;
	let imageUrl = `${BASE_URL}/api/og?title=${frontmatter.title}`;

	if (section) {
		title = `${frontmatter.title} - ${frontmatter.section ?? docsSection} - BaseAI`;
		imageUrl = `${BASE_URL}/api/og?title=${frontmatter.title}&section=${docsSection}`;

		const isAppPath = APPS.includes(section);
		const isIndexPath = slug === 'index';

		// if app path but the slug is not index, then we need to add the slug to the url
		if (isAppPath && !isIndexPath) {
			url = `${baseUrl}/${slug}`;
		}

		// if not app path but the slug is index, then we need to add the section to the url
		// EXAMPLE: /docs/getting-started OR /docs/pipe
		if (!isAppPath && isIndexPath) {
			url = `${baseUrl}/${section}`;
		}

		// If not app path and not index, then we need to add the section and slug to the url
		// EXAMPLE: /docs/getting-started/project-structure
		if (!isAppPath && !isIndexPath) {
			url = `${baseUrl}/${section}/${slug}`;
		}
	}

	return {
		frontmatter: {
			url,
			slug,
			title,
			imageUrl,
			tags: frontmatter.tags ?? [],
			section: frontmatter.section || '',
			description: frontmatter.description || '',
			modifiedDate: new Date(frontmatter.modified) || new Date(),
			publishedDate: new Date(frontmatter.published) || new Date()
		},
		content: mdxSource
	};
}

const generateDocsContent = async () => {
	try {
		const files = fs.readdirSync(`${DOCS_BASE_URL}`);
		const docs = [];

		const sections = files.filter(file => file !== '.DS_Store');

		for (const section of sections) {
			if (section.includes('docs.json')) continue;

			const filesInSection = fs.readdirSync(
				`${DOCS_BASE_URL}/${section}`
			);

			for (const file of filesInSection) {
				if (file.includes('.DS_Store')) continue;

				const slug = file.replace('.mdx', '');
				const { frontmatter, content } = await fetchMDXContent({
					slug,
					section,
					dirPath: DOCS_BASE_URL,
					baseUrl: `${BASE_URL}/docs`
				});

				docs.push({
					slug,
					section,
					content,
					frontmatter
				});
			}
		}

		await fs.promises.writeFile(
			`${DOCS_BASE_URL}/docs.json`,
			JSON.stringify(docs)
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

const generateLearnContent = async () => {
	try {
		const files = fs.readdirSync(`${LEARN_BASE_URL}`);
		const docs = [];

		const sections = files.filter(file => file !== '.DS_Store');

		for (const section of sections) {
			if (section.includes('learn.json')) continue;

			const filesInSection = fs.readdirSync(
				`${LEARN_BASE_URL}/${section}`
			);

			for (const file of filesInSection) {
				if (file.includes('.DS_Store')) continue;

				const slug = file.replace('.mdx', '');
				const { frontmatter, content } = await fetchMDXContent({
					slug,
					section,
					dirPath: LEARN_BASE_URL,
					baseUrl: `${BASE_URL}/learn`
				});

				docs.push({
					slug,
					section,
					content,
					frontmatter
				});
			}
		}

		await fs.promises.writeFile(
			`${LEARN_BASE_URL}/learn.json`,
			JSON.stringify(docs)
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

(async () => {
	try {
		await generateDocsContent();
		await generateLearnContent();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
