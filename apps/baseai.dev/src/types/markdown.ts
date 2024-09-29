import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type ContentT =
	| MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
	| undefined;

export type FrontmatterT = {
	url: string;
	slug: string;
	title: string;
	imageUrl: string;
	tags: string | string[];
	section: string;
	description: string;
	modifiedDate: string | Date;
	publishedDate: string | Date;
};
