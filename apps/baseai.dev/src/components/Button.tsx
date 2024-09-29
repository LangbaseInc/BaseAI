import Link from 'next/link';
import clsx from 'clsx';

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
			/>
		</svg>
	);
}

const variantStyles = {
	primary:
		'inline-flex items-center justify-center text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer py-1 px-3 font-semibold rounded-lg justify-center relative inline-flex items-center transition-colors focus:z-10 tracking-wide text-base hover:cursor-pointer focus:outline bg-primary text-primary-foreground shadow hover:bg-primary/90',
	secondary:
		'inline-flex items-center justify-center text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-lg bg-zinc-100 py-1 px-3 bg-secondary text-secondary-foreground shadow-base hover:bg-secondary/80',
	outline:
		'inline-flex items-center justify-center text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-lg py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 text-foreground border border-input bg-transparent shadow-base hover:bg-foreground hover:text-background',
	'outline-muted':
		'inline-flex items-center justify-center text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer py-1 px-3 rounded-lg border border-input bg-muted text-foreground shadow-base hover:bg-foreground hover:text-background',
	text: 'text-[hsl(46.38 70.61% 48.04%)] hover:text-[hsl(46.38 70.61% 48.04%)] dark:text-[#fad000] dark:hover:text-[#fad000]'
};

type ButtonProps = {
	variant?: keyof typeof variantStyles;
	arrow?: 'left' | 'right';
} & (
	| React.ComponentPropsWithoutRef<typeof Link>
	| (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
);

export function Button({
	variant = 'primary',
	className,
	children,
	arrow,
	...props
}: ButtonProps) {
	className = clsx(
		'inline-flex gap-0.5 justify-center overflow-hidden text-base font-medium transition',
		variantStyles[variant],
		className
	);

	let arrowIcon = (
		<ArrowIcon
			className={clsx(
				'mt-0.5 h-5 w-5',
				variant === 'text' && 'relative top-px',
				arrow === 'left' && '-ml-1 rotate-180',
				arrow === 'right' && '-mr-1'
			)}
		/>
	);

	let inner = (
		<>
			{arrow === 'left' && arrowIcon}
			{children}
			{arrow === 'right' && arrowIcon}
		</>
	);

	if (typeof props.href === 'undefined') {
		return (
			<button className={className} {...props}>
				{inner}
			</button>
		);
	}

	return (
		<Link className={className} {...props}>
			{inner}
		</Link>
	);
}
