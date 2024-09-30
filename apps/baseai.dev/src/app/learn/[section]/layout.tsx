import { getLearnBySlug } from "@/lib/get-learn-by-slug";
import { FrontmatterT } from "@/types/markdown";

export async function generateMetadata({
	params
}: {
	params: { section: string, slug: string };
}) {
	let frontmatter: FrontmatterT;

	if (process.env.NODE_ENV === 'production') {
		const data = await getLearnBySlug({
			section: 'learn',
			slug: params.section
		});

		frontmatter = data.frontmatter as unknown as FrontmatterT;
	} else {
		const { getContentBySlugOnDev } = await import('@/lib/get-content-by-slug-on-dev');

		const data = await getContentBySlugOnDev({
			type: 'learn',
			slug: params.section,
			section: 'learn',
		});

		frontmatter = data.frontmatter;
	}


	return {
		title: frontmatter?.title,
		description: frontmatter?.description,
		keywords: frontmatter?.tags,
		openGraph: {
			title: frontmatter?.title,
			description: frontmatter?.description,
			url: frontmatter?.url,
			images: [
				{
					url: frontmatter?.imageUrl,
					alt: frontmatter?.title
				}
			]
		},
		twitter: {
			title: frontmatter?.title,
			description: frontmatter?.description,
			image: frontmatter?.imageUrl
		},
		alternates: {
			canonical: frontmatter?.url
		}
	};
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
	params: { section: string };
}) {
	return <>{children}</>;
}
