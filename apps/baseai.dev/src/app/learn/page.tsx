import Content from '@/components/content';
import { getLearnBySlug } from '@/lib/get-learn-by-slug';
import { ContentT } from '@/types/markdown';

export default async function LearnPage() {
	let content: ContentT;

	if (process.env.NODE_ENV === 'production') {
		const data = await getLearnBySlug({
			slug: 'index',
			section: 'learn',
		});

		content = data.content;
	} else {
		// dynamically import the file
		const { getContentBySlugOnDev } = await import('@/lib/get-content-by-slug-on-dev');

		const data = await getContentBySlugOnDev({
			section: 'learn',
			slug: 'index',
			type: 'learn'
		});

		content = data.content;
	}

	return <Content content={content} />;
}
