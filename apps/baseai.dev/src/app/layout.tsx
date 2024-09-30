import { Providers } from '@/app/providers';
import '@/styles/tailwind.css';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: 'BaseAI - Web AI Framework',
		default: 'BaseAI - Web AI Framework'
	},
	description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
	openGraph: {
		title: 'BaseAI - Web AI Framework',
		description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
		images: ['https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-ogg.jpg'],
		siteName: 'BaseAI'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'BaseAI - Web AI Framework',
		creator: '@LangbaseInc',
		description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
		images: ['https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-ogg.jpg']
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
