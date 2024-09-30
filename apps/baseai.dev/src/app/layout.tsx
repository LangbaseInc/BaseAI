import { Providers } from '@/app/providers';
import '@/styles/tailwind.css';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: 'BaseAI - The first AI framework for web',
		default: 'BaseAI'
	},
	description: `BaseAI helps developers locally build AI agents, memory (RAG), and then deploy them to a highly scalable API. It is the first AI framework for Web. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
	openGraph: {
		title: 'BaseAI - The first AI framework for web',
		description: `BaseAI helps developers locally build AI agents, memory (RAG), and then deploy them to a highly scalable API. It is the first AI framework for Web. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
		images: ['https://baseai.dev/api/og?title=baseai.dev'],
		siteName: 'BaseAI'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'BaseAI - The first AI framework for web',
		creator: '@LangbaseInc',
		description: `BaseAI helps developers locally build AI agents, memory (RAG), and then deploy them to a highly scalable API. It is the first AI framework for Web. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
		images: ['https://baseai.dev/api/og?title=baseai.dev']
	},
	authors: [{ name: 'Langbase, Inc.' }],
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true
		}
	},
	keywords: 'BaseAI, Web AI framework'
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
