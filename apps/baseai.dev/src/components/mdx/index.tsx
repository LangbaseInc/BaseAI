import { Code, CodeGroup, Pre } from '@/components/Code';
import { CodeExamples } from '@/components/CodeExamples';
import { Heading as HeadingComp } from '@/components/Heading';
import Image from '@/components/Img';
import { LbLogo } from '@/components/lb-logo';
import { Col } from '@/components/mdx/Col';
import { Info } from '@/components/mdx/Info';
import { InlineCopy } from '@/components/mdx/InlineCodeCopy';
import { Note } from '@/components/mdx/Note';
import { Properties } from '@/components/mdx/Properties';
import { Property } from '@/components/mdx/Property';
import { Row } from '@/components/mdx/Row';
import { Spoiler } from '@/components/mdx/spoiler';
import { SpoilerAdvanced } from '@/components/mdx/spoiler-advanced';
import { Sub } from '@/components/mdx/sub-property';
import { Warn } from '@/components/mdx/Warn';
import { Wrapper } from '@/components/mdx/Wrapper';
import { ProductsTable } from '@/components/table-products';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import BaseAILogo from '../baseai-logo';
import { Button } from '../Button';
import { Guides } from '../Guides';
import { CTAButtons } from '../ui/cta-buttons';
import { IconInfoCircle } from '../ui/icons/info';

export const MarkdownComponents = () => {
	return {
		a: (props: any) => {
			// Check if the link is external
			const isExternal = props.href.startsWith('http');

			//  Open external links in new tab
			if (isExternal) {
				return (
					<a
						{...props}
						target="_blank"
						rel="noopener noreferrer"
						className="text-indigo-400"
					/>
				);
			}
			return <Link {...props} className="text-indigo-400" />;
		},
		Img: (props: any) => {
			return <Image {...props} />;
		},
		img: (props: any) => {
			return <Image {...props} />;
		},
		hr: (props: any) => {
			return (
				<hr
					className="my-12 h-[3px] w-full border-0 border-b-[2px] border-border bg-background"
					{...props}
				/>
			);
		},
		table: (props: any) => {
			return (
				<table
					className="overflow-x-auto whitespace-nowrap"
					{...props}
				/>
			);
		},
		h2: (props: any) => {
			return <HeadingComp level={2} {...props} />;
		},
		Heading: (props: any) => {
			return <HeadingComp {...props} />;
		},
		DesktopOnly: (props: any) => {
			return <div className="hidden xl:block" {...props} />;
		},
		CodeExamples: (props: any) => {
			return <CodeExamples {...props} />;
		},
		LbLogo: (props: any) => {
			return <LbLogo {...props} />;
		},
		Col: (props: any) => {
			return <Col {...props} />;
		},
		InlineCopy: (props: any) => {
			return <InlineCopy {...props} />;
		},
		Note: (props: any) => {
			return <Note {...props} />;
		},
		Info: (props: any) => {
			return <Info {...props} />;
		},
		Properties: (props: any) => {
			return <Properties {...props} />;
		},
		Property: (props: any) => {
			return <Property {...props} />;
		},
		Row: (props: any) => {
			return <Row {...props} />;
		},
		Spoiler: (props: any) => {
			return <Spoiler {...props} />;
		},
		SpoilerAdvanced: (props: any) => {
			return <SpoilerAdvanced {...props} />;
		},
		Sub: (props: any) => {
			return <Sub {...props} />;
		},
		Warn: (props: any) => {
			return <Warn {...props} />;
		},
		Wrapper: (props: any) => {
			return <Wrapper {...props} />;
		},
		ProductsTable: (props: any) => {
			return <ProductsTable {...props} />;
		},
		Button: (props: any) => {
			return <Button {...props} />;
		},
		InformationCircleIcon: (props: any) => {
			return <InformationCircleIcon {...props} />;
		},
		CTAButtons: (props: any) => {
			return <CTAButtons {...props} />;
		},
		IconInfoCircle: (props: any) => {
			return <IconInfoCircle {...props} />;
		},
		code: (props: any) => {
			return <Code {...props} />;
		},
		CodeGroup: (props: any) => {
			return <CodeGroup {...props} />;
		},
		pre: (props: any) => {
			return <Pre {...props} />;
		},
		Guides: (props: any) => {
			return <Guides {...props} />;
		},
		BaseAILogo: (props: any) => {
			return <BaseAILogo {...props} />;
		}
	};
};
