import docsContent from '../../content/docs/docs.json';

export async function getDocsBySlug({
	slug,
	section
}: {
	slug: string;
	section?: string;
}) {
	const docContent = docsContent.find(
		doc => doc.slug === slug && doc.section === section
	);

	return {
		content: docContent?.content,
		frontmatter: docContent?.frontmatter
	};
}
