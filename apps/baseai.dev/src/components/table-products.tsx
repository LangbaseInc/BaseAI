import Link from 'next/link';
import React from 'react';

interface ProductLinkProps {
	href: string;
	children: React.ReactNode;
}

const TableHeader: React.FC = () => (
	<thead>
		<tr>
			<th className="w-[180px] p-2 text-left font-semibold">Products</th>
			<th className="p-2 text-left font-semibold">Description</th>
		</tr>
	</thead>
);

interface ProductName {
	main: string;
	sub?: string;
}

interface TableRowProps {
	product: ProductName;
	description: React.ReactNode;
	href: string;
}

const TableRow: React.FC<TableRowProps> = ({ product, description, href }) => (
	<tr>
		<td className="w-[180px] p-2 align-top">
			<Link href={href}>⌘ {product.main}</Link>
			{product.sub && (
				<div className="xtext-muted-foreground/50 mt-1 text-sm text-[#7f7db0]/50">
					({product.sub})
				</div>
			)}
		</td>
		<td className="p-2">{description}</td>
	</tr>
);

const AIPipesDescription: React.FC = () => (
	<>
		Pipe is a serverless AI agent. Your custom-built AI agent available
		locally and online as an API. Local first, highly scalable, dynamic, and
		inexpensive when deployed. A new LLM computing primitive called{' '}
		<Link href="/docs/pipe/quickstart">Pipe</Link>. Pipe is the fastest way
		to ship your AI features in production. It&apos;s like having a
		composable GPT anywhere.
	</>
);

const AIMemoryDescription: React.FC = () => (
	<>
		Memory is a managed search engine available locally and as an API for
		developers. Our long-term memory solution has the ability to acquire,
		process, retain, and later retrieve information. It combines vector
		storage, RAG (Retrieval-Augmented Generation), and internet access to
		help you build powerful AI features and products.
	</>
);

const LangbaseStudioDescription: React.FC = () => (
	<>
		Agentic AI tools that seamlessly work together with AI pipes. Extend the
		model capabilities of AI Pipes and AI Memory. Connect multiple AI pipes
		together via tools. Build truly composable AI agents with memory (RAG).
	</>
);

export const ProductsTable: React.FC = () => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full">
				<TableHeader />
				<tbody>
					<TableRow
						product={{ main: 'AI Pipes', sub: 'Agents' }}
						description={<AIPipesDescription />}
						href="/docs/pipe/quickstart"
					/>
					<TableRow
						product={{ main: 'AI Memory', sub: 'RAG' }}
						description={<AIMemoryDescription />}
						href="/docs/memory/quickstart"
					/>
					<TableRow
						product={{ main: 'AI Tools', sub: 'Self-healing' }}
						description={<LangbaseStudioDescription />}
						href="/docs/tools/quickstart"
					/>
				</tbody>
			</table>
		</div>
	);
};
