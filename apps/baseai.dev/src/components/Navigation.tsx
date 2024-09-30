'use client';

import { useIsInsideMobileNavigation } from '@/components/MobileNavigation';
import { useSectionStore } from '@/components/SectionProvider';
import { Tag } from '@/components/Tag';
import navigationData, { NavigationItem, navLearn } from '@/data/navigation';
import { remToPx } from '@/lib/remToPx';
import clsx from 'clsx';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function useInitialValue<T>(value: T, condition = true) {
	let initialValue = useRef(value).current;
	return condition ? initialValue : value;
}

// function TopLevelNavItem({
// 	href,
// 	children
// }: {
// 	href: string;
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<li className="md:hidden">
// 			<Link
// 				href={href}
// 				className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
// 			>
// 				{children}
// 			</Link>
// 		</li>
// 	);
// }

function VisibleSectionHighlight({
	group,
	pathname
}: {
	group: NavigationItem;
	pathname: string;
}) {
	let isPresent = useIsPresent();
	let itemHeight = remToPx(2);
	let height = isPresent ? Math.max(1) * itemHeight : itemHeight;
	let top =
		group.links.findIndex(link => link.href === pathname) * itemHeight;

	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 0.2 } }}
			exit={{ opacity: 0 }}
			className="absolute inset-x-0 top-0 bg-zinc-800/5 will-change-transform dark:bg-white/2.5"
			style={{ borderRadius: 8, height, top }}
		/>
	);
}

function ActivePageMarker({
	group,
	pathname
}: {
	group: NavigationItem;
	pathname: string;
}) {
	let itemHeight = remToPx(2);
	let offset = remToPx(0.25);
	let activePageIndex = group.links.findIndex(link => link.href === pathname);
	let top = offset + activePageIndex * itemHeight;

	return (
		<motion.div
			layout
			className="absolute left-2 h-6 w-px bg-zinc-800 dark:bg-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 0.2 } }}
			exit={{ opacity: 0 }}
			style={{ top }}
		/>
	);
}

function NavLink({
	href,
	children,
	tag,
	active = false,
	isAnchorLink = false,
	navRef
}: {
	href: string;
	children: React.ReactNode;
	tag?: string;
	active?: boolean;
	isAnchorLink?: boolean;
	navRef?: React.RefObject<HTMLAnchorElement>;
}) {
	const number = children?.toString().split('.')[0];
	const hasNumber = isNaN(parseInt(number!)) === false;
	let content = children;

	if (hasNumber) {
		content = children?.toString().split('.').slice(1).join('.');
	}

	return (
		<Link
			href={href}
			aria-current={active ? 'page' : undefined}
			ref={navRef}
			className={clsx(
				'flex scroll-mt-16 items-center gap-2 py-1 pr-3 text-sm transition',
				isAnchorLink ? 'pl-7' : 'pl-4',
				active
					? 'text-zinc-900 dark:text-white'
					: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
			)}
		>
			{hasNumber && (
				<code className="mr-2 flex w-auto justify-end rounded-md bg-muted/60 px-2 opacity-50 ring-2 ring-muted">
					{number}
				</code>
			)}
			<span className="truncate">{content}</span>
			{tag && (
				<Tag variant="small" color="zinc">
					{tag}
				</Tag>
			)}
		</Link>
	);
}

function NavigationGroup({
	group,
	className
}: {
	group: NavigationItem;
	className?: string;
}) {
	// If this is the mobile navigation then we always render the initial
	// state, so that the state does not change during the close animation.
	// The state will still update when we re-open (re-render) the navigation.
	let isInsideMobileNavigation = useIsInsideMobileNavigation();
	let [pathname, sections] = useInitialValue(
		[usePathname(), useSectionStore(s => s.sections)],
		isInsideMobileNavigation
	);
	let isActiveGroup =
		group.links.findIndex(link => link.href === pathname) !== -1;

	// Scroll to active link
	const activeLinkRef = useRef<HTMLAnchorElement>(null);
	useEffect(() => {
		if (activeLinkRef.current) {
			const rect = activeLinkRef.current.getBoundingClientRect();
			const isInView =
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <=
					(window.innerHeight ||
						document.documentElement.clientHeight) &&
				rect.right <=
					(window.innerWidth || document.documentElement.clientWidth);

			// Only scroll if the active link is not in view
			if (!isInView) {
				activeLinkRef.current.scrollIntoView({
					behavior: 'instant'
				});
			}
		}
	}, []);

	return (
		<li className={clsx('relative mt-6', className)}>
			<motion.h2
				layout="position"
				className="text-xs font-semibold text-zinc-900 dark:text-white"
			>
				{group.isCommand ? (
					<code className="rounded-lg bg-muted/60 px-2 py-1 ring-2 ring-muted">
						{group.title}
					</code>
				) : (
					group.title
				)}
			</motion.h2>
			<div className="relative mt-3 pl-2">
				<AnimatePresence initial={!isInsideMobileNavigation}>
					{isActiveGroup && (
						<VisibleSectionHighlight
							group={group}
							pathname={pathname}
						/>
					)}
				</AnimatePresence>
				<motion.div
					layout
					className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
				/>
				<AnimatePresence initial={false}>
					{isActiveGroup && (
						<ActivePageMarker group={group} pathname={pathname} />
					)}
				</AnimatePresence>
				<ul role="list" className="border-l border-transparent">
					{group.links.map(link => (
						<motion.li
							key={link.href}
							layout="position"
							className="relative"
						>
							<NavLink
								href={link.href}
								active={link.href === pathname}
								navRef={
									link.href === pathname
										? activeLinkRef
										: undefined
								}
							>
								{link.title}
							</NavLink>
							<AnimatePresence mode="popLayout" initial={false}>
								{/* Sections */}
								{pathname.includes(link.href) &&
									link.sections &&
									link.sections.length > 0 && (
										<motion.ul
											role="list"
											initial={{ opacity: 0 }}
											animate={{
												opacity: 1,
												transition: { delay: 0.1 }
											}}
											exit={{
												opacity: 0,
												transition: { duration: 0.15 }
											}}
										>
											{link.sections.map(section => (
												<motion.li
													key={section.href}
													layout="position"
													className="relative"
												>
													<li
														className="ml-4"
														key={section.title}
													>
														<NavLink
															href={`${section.href}`}
															active={
																`${section.href}` ===
																pathname
															}
														>
															{section.title}
														</NavLink>
													</li>
												</motion.li>
											))}
										</motion.ul>
									)}
							</AnimatePresence>
						</motion.li>
					))}
				</ul>
			</div>
		</li>
	);
}

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
	const pathname = usePathname();
	const isLearn = pathname.startsWith('/learn');
	const navLinks = isLearn ? navLearn : navigationData;

	return (
		<nav {...props}>
			<ul role="list">
				{navLinks.map((group, groupIndex) => (
					<NavigationGroup
						key={group.title}
						group={group}
						className={groupIndex === 0 ? 'md:mt-0' : ''}
					/>
				))}
				{/* <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li> */}
			</ul>
		</nav>
	);
}
