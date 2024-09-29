import { Layout } from '@/components/Layout';
import { getLearnBySlug } from '@/lib/get-learn-by-slug';
import '@/styles/tailwind.css';

export async function generateMetadata() {
	const { frontmatter } = await getLearnBySlug({
		slug: 'index',
		section: 'learn',
	});

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
}) {
	// let pages = await glob('**/*.mdx', { cwd: './../../../content' });
	// let allSectionsEntries = (await Promise.all(
	// 	pages.map(async filename => [
	// 		'/' + filename.replace(/(^|\/)page\.mdx$/, ''),
	// 		(await import(`./${filename}`)).sections
	// 	])
	// )) as Array<[string, Array<Section>]>;
	let allSections = {}

	return (
		<div className="flex min-h-full bg-background antialiased">
			<div className="w-full bg-background">
				<Layout allSections={allSections}>{children}</Layout>
			</div>
		</div>
	);
}
