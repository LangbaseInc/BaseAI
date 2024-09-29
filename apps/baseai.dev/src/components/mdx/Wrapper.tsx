import { Prose } from '@/components/Prose';

// Article layout wrapper
export function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<article className="flex h-full flex-col pb-10">
			<Prose className="mt-32 flex-auto md:mt-16">{children}</Prose>
		</article>
	);
}
