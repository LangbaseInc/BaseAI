'use client';

import { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { RecoilRoot } from 'recoil';
import { usePathname } from 'next/navigation';

const FORCE_DARK_MODE_PAGES = ['/'];

function ThemeWatcher() {
	let { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		let media = window.matchMedia('(prefers-color-scheme: dark)');

		function onMediaChange() {
			let systemTheme = media.matches ? 'dark' : 'light';
			if (resolvedTheme === systemTheme) {
				setTheme('system');
			}
		}

		onMediaChange();
		media.addEventListener('change', onMediaChange);

		return () => {
			media.removeEventListener('change', onMediaChange);
		};
	}, [resolvedTheme, setTheme]);

	return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const website = FORCE_DARK_MODE_PAGES.includes(pathname);
	return (
		<ThemeProvider
			attribute="class"
			disableTransitionOnChange
			forcedTheme={website ? 'dark' : undefined}
		>
			<ThemeWatcher />
			<RecoilRoot>{children}</RecoilRoot>
		</ThemeProvider>
	);
}
