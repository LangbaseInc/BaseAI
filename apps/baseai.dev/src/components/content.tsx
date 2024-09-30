'use client';

import { MarkdownComponents } from '@/components/mdx';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Wrapper } from './mdx/Wrapper';
import dynamic from 'next/dynamic';

const MDXRemote = dynamic(
	() => import('next-mdx-remote').then(mod => mod.MDXRemote),
	{ ssr: false }
);

export default function Content({
	content
}: {
	content?: MDXRemoteSerializeResult<
		Record<string, unknown>,
		Record<string, unknown>
	>;
}) {
	const domain = process.env.CF_PAGES_URL || 'http://localhost:test';
	const branch = process.env.CF_PAGES_BRANCH || 'developmenttest';

	console.log(`Current domain: ${domain}`);
	console.log(`Current branch: ${branch}`);

	return (
		<Wrapper>
			{content && (
				<MDXRemote {...content} components={MarkdownComponents()} />
			)}
		</Wrapper>
	);
}
