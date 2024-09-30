import Link from 'next/link';
import { Button } from './button';
import cn from 'mxcn';

export function CTAButtons({
	primary,
	secondary,
	example,
	className
}: {
	example?: boolean;
	primary?: {
		text: string;
		sub?: string;
		href: string;
	};
	secondary?: {
		text: string;
		href: string;
	};
	className?: string;
}) {
	const isInternalLink = (href: string) =>
		href.startsWith('https://langbase.com/docs') || href.startsWith('/');

	const LinkWrapper = ({
		href,
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
		if (isInternalLink(href)) {
			return (
				<Link href={href} {...props}>
					{children}
				</Link>
			);
		}
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...props}>
				{children}
			</a>
		);
	};

	return (
		<div className={cn('not-prose mb-16 mt-12 flex gap-3 flex-wrap', className)}>
			{primary && (
				<LinkWrapper href={primary.href}>
					<Button
						arrow="right"
						className="flex w-full justify-center sm:w-auto"
						variant={example ? 'outline-background' : 'default'}
					>
						{primary.text}
						<span className="ml-1 hidden text-background transition-colors duration-200 hover:text-background sm:inline dark:text-background dark:hover:text-muted">
							{primary.sub}
						</span>
					</Button>
				</LinkWrapper>
			)}
			{secondary && (
				<LinkWrapper href={secondary.href}>
					<Button
						variant="outline"
						className="flex w-full justify-center sm:w-auto"
					>
						{secondary.text}
					</Button>
				</LinkWrapper>
			)}
		</div>
	);
}
