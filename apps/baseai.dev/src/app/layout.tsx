import { Providers } from '@/app/providers';
import CrispClient from '@/components/crisp';
import '@/styles/tailwind.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
	return {
		title: {
			template: 'BaseAI - The first Web AI Framework',
			default: 'BaseAI - The first Web AI Framework'
		},
		description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
		openGraph: {
			title: 'BaseAI - The first Web AI Framework',
			description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
			images: [
				'https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-ogg.jpg'
			],
			siteName: 'BaseAI'
		},
		twitter: {
			card: 'summary_large_image',
			title: 'BaseAI - The first Web AI Framework',
			creator: '@LangbaseInc',
			description: `BaseAI is the first web AI framework. Deployable with Langbase the composable serverless AI cloud. Built with a focus on simplicity and composability. Helping developers build AI agents with memory (RAG), and deploy serverless. It's composable by design and offers a simple API to build and deploy any AI agents (AI features).`,
			images: [
				'https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-ogg.jpg'
			]
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
		keywords: 'BaseAI, Web AI framework',
		alternates: {
			canonical: 'https://baseai.dev'
		}
	};
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<Providers>
					<CrispClient />
					{children}
				</Providers>
			</body>
		</html>
	);
}
