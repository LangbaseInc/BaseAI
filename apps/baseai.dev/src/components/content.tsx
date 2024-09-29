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
	return (
		<Wrapper>
			{content && (
				<MDXRemote {...content} components={MarkdownComponents()} />
			)}
		</Wrapper>
	);
}
