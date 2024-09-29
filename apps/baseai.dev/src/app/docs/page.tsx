import Content from '@/components/content';
import { getDocsBySlug } from '@/lib/get-docs-by-slug';
import { ContentT } from '@/types/markdown';

export default async function DocPage() {
	let content: ContentT;

	if (process.env.NODE_ENV === 'production') {
		const data = await getDocsBySlug({
			section: 'docs',
			slug: 'index'
		});

		content = data.content;
	} else {
		// dynamically import the file
		const { getContentBySlugOnDev } = await import('@/lib/get-content-by-slug-on-dev');

		const data = await getContentBySlugOnDev({
			type: 'docs',
			slug: 'index',
			section: 'docs',
		});

		content = data.content;
	}

	return <Content content={content} />;
}
