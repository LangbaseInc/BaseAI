import learnContent from '../../content/learn/learn.json';

export async function getLearnBySlug({
	slug,
	section
}: {
	slug: string;
	section?: string;
}) {
	const docContent = learnContent.find(
		doc => doc.slug === slug && doc.section === section
	);

	return {
		content: docContent?.content,
		frontmatter: docContent?.frontmatter
	};
}
