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
	console.log('env', process.env);
	console.log('__NEXT_PRIVATE_ORIGIN', process.env.__NEXT_PRIVATE_ORIGIN!);

	return (
		<Wrapper>
			{content && (
				<MDXRemote {...content} components={MarkdownComponents()} />
			)}
		</Wrapper>
	);
}
