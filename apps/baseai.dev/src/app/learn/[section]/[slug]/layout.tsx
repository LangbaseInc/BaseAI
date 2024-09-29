import { getLearnBySlug } from "@/lib/get-learn-by-slug";
import { FrontmatterT } from "@/types/markdown";

export async function generateMetadata({
	params
}: {
	params: { section: string; slug: string };
}) {
	let frontmatter: FrontmatterT;

	if (process.env.NODE_ENV === 'production') {
		const data = await getLearnBySlug({
			section: params.section,
			slug: params.slug
		});

		frontmatter = data.frontmatter!;
	} else {
		// dynamically import the file
		const { getContentBySlugOnDev } = await import('@/lib/get-content-by-slug-on-dev');

		const data = await getContentBySlugOnDev({
			type: 'learn',
			slug: params.slug,
			section: params.section,
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
	params: { section: string; slug: string };
}) {
	return <>{children}</>;
}
