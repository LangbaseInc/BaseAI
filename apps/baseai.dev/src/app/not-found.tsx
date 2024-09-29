'use client';

import { Button } from '@/components/Button';
import { HeroPattern } from '@/components/HeroPattern';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="prose dark:prose-invert">
			<HeroPattern />
			<div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
				<p>404</p>
				<h1>Page not found</h1>
				<p>Sorry, we couldn’t find the page you’re looking for.</p>
				<Button
					onClick={() => router.push('/docs')}
					arrow="right"
					className="mt-8"
				>
					Back to docs
				</Button>
			</div>
		</div>
	);
}
