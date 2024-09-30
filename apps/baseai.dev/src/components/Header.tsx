import navigationData, { navLearn } from '@/data/navigation';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

import {
	MobileNavigation,
	useIsInsideMobileNavigation,
	useMobileNavigationStore
} from '@/components/MobileNavigation';
import { MobileSearch, Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import BaseAILogo from './baseai-logo';
import { Anchor } from './ui/anchor';
import { IconDocs } from './ui/iconists/icon-docs';

/**
 * Retrieves the section title based on the provided pathname.
 *
 * @param {string} pathname - The current pathname.
 * @returns {string} - The section title.
 */
function getSectionTitle({
	pathname,
	isLearnPath
}: {
	pathname: string;
	isLearnPath: boolean;
}) {
	let currentTitle = '';
	const navData = isLearnPath ? navLearn : navigationData;

	for (const item of navData) {
		const foundLink = item.links.find(link => {
			if (link.href === pathname) {
				return true;
			}

			if (link.sections) {
				return link.sections.find(section => section.href === pathname);
			}
		});

		// If the link has sections, we need to find the matching section title
		if (foundLink?.sections?.length) {
			currentTitle = foundLink.title;
			break; // Stop searching once we've found the matching href
		}

		// If the link has no sections, we can use the link title
		if (foundLink) {
			currentTitle = item.title;
			break; // Stop searching once we've found the matching href
		}
	}

	return currentTitle;
}

function HeaderLinks() {
	const pathname = usePathname();
	const isLearnPath = pathname.startsWith('/learn');
	const href = isLearnPath ? '/docs' : '/learn';
	const text = isLearnPath ? 'Docs' : 'Learn';

	return (
		<>
			<Anchor
				href={'https://github.com/LangbaseInc/baseai'}
				target="_blank"
				className="hidden w-auto font-semibold lg:flex "
				variant={'ghost'}
			>
				★ BaseAI
			</Anchor>
			<Anchor
				href={href}
				className="w-28 font-semibold"
				variant={'default'}
			>
				{text}
			</Anchor>
		</>
	);
}

export const Header = forwardRef<
	React.ElementRef<'div'>,
	{ className?: string }
>(function Header({ className }, ref) {
	let { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
	let isInsideMobileNavigation = useIsInsideMobileNavigation();
	const pathname = usePathname();
	const isLearnPath = pathname.startsWith('/learn');
	let currentTitle = getSectionTitle({ pathname, isLearnPath }) || 'BaseAI';

	let { scrollY } = useScroll();
	let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
	let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

	return (
		<motion.div
			ref={ref}
			className={clsx(
				className,
				'fixed inset-0 inset-x-0 top-0 z-50 flex h-14 px-4 md:static md:mx-5 md:my-6 md:flex md:h-auto md:items-center md:justify-between md:gap-12 md:px-0 md:transition lg:left-72 lg:z-30 xl:left-80',
				!isInsideMobileNavigation &&
					'backdrop-blur-sm lg:left-72 xl:left-80 dark:backdrop-blur',
				isInsideMobileNavigation ? 'xbg-background' : 'xbg-background'
			)}
			style={
				{
					'--bg-opacity-light': bgOpacityLight,
					'--bg-opacity-dark': bgOpacityDark
				} as React.CSSProperties
			}
		>
			<div className="xbg-zinc-900/7.5 xdark:bg-white/7.5 absolute inset-x-0 top-full h-px transition md:hidden" />

			<div className="hidden md:block">
				<h2 className="flex items-center text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
					<IconDocs
						className="mr-4 h-7 w-7 text-muted-foreground/50"
						aria-hidden="true"
					/>
					{currentTitle}
				</h2>
			</div>
			<div className="flex w-full justify-between md:w-1/2 md:justify-end  md:space-x-6">
				<Search />
				<div className="flex items-center gap-5 lg:hidden">
					<MobileNavigation />
					<Link
						href="/"
						aria-label="Home"
						className="font-bold text-black dark:text-white"
					>
						<BaseAILogo width="30%" />
					</Link>
				</div>
				<div className="flex items-center justify-end gap-5">
					<div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
					<div className="flex items-center gap-4">
						<MobileSearch />
						<HeaderLinks />
						<ThemeToggle />
					</div>
				</div>
			</div>
		</motion.div>
	);
});
