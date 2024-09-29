import fs from 'fs';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { recmaPlugins } from '@/mdx/recma';
import { rehypePlugins } from '@/mdx/rehype';
import { remarkPlugins } from '@/mdx/remark';

const BASE_URL = 'https://baseai.dev';
const APPS = ['docs', 'learn'];

/**
 * Formats a section string by replacing hyphens with spaces and capitalizing the first letter of each word.
 *
 * @param section - The section string to format.
 * @returns The formatted section string.
 */
export function formatString(section?: string) {
	if (!section) return '';
	return section
		.replace(/-/g, ' ')
		.replace(/\b\w/g, char => char.toUpperCase());
}

const DOCS_CONTENT_PATH = `${process.cwd()}/content/docs`;
const LEARN_CONTENT_PATH = `${process.cwd()}/content/learn`;

export async function getContentBySlugOnDev({
	slug,
	section,
	type
}: {
	slug: string;
	section?: string;
	type: 'docs' | 'learn';
}) {
	const BASE_PATH = type === 'docs' ? DOCS_CONTENT_PATH : LEARN_CONTENT_PATH;

	try {
		const markdownWithMeta = section
			? fs.readFileSync(`${BASE_PATH}/${section}/${slug}.mdx`, 'utf-8')
			: fs.readFileSync(`${BASE_PATH}/${slug}.mdx`, 'utf-8');

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
		let url = `${BASE_URL}/${type}`;
		let imageUrl = `${BASE_URL}/api/og?title=${frontmatter.title}`;

		if (section) {
			title = `${frontmatter.title} - ${frontmatter.section ?? docsSection} - BaseAI`;
			imageUrl = `${BASE_URL}/api/og?title=${frontmatter.title}&section=${docsSection}`;

			const isAppPath = APPS.includes(section);
			const isIndexPath = slug === 'index';

			// if app path but the slug is not index, then we need to add the slug to the url
			if (isAppPath && !isIndexPath) {
				url = `${BASE_URL}/${type}/${slug}`;
			}

			// if not app path but the slug is index, then we need to add the section to the url
			// EXAMPLE: /docs/getting-started OR /docs/pipe
			if (!isAppPath && isIndexPath) {
				url = `${BASE_URL}/${type}/${section}`;
			}

			// If not app path and not index, then we need to add the section and slug to the url
			// EXAMPLE: /docs/getting-started/project-structure
			if (!isAppPath && !isIndexPath) {
				url = `${BASE_URL}/${type}/${section}/${slug}`;
			}
		}

		return {
			frontmatter: {
				url,
				slug,
				title,
				imageUrl,
				tags: frontmatter.tags,
				section: frontmatter.section,
				description: frontmatter.description,
				modifiedDate: new Date(),
				publishedDate: new Date(frontmatter.published)
			},
			content: mdxSource
		};
	} catch (error) {
		return {
			frontmatter: {
				url: 'https://baseai.dev',
				slug: '',
				title: 'BaseAI',
				imageUrl: 'https://baseai.dev/api/og?title=BaseAI',
				tags: ['BaseAI', 'Docs', 'Learn'],
				section: 'docs',
				description: '',
				modifiedDate: new Date(),
				publishedDate: new Date()
			}
		};
	}
}
