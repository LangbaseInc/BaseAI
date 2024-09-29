'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import cn from 'mxcn';

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

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				'destructive-hover':
					'bg-background border-input text-destructive font-bold shadow-sm hover:bg-destructive hover:text-destructive-foreground border border-input',
				'outline-background':
					'border border-input bg-background text-foreground shadow-sm hover:bg-foreground hover:text-background transition-colors',
				'outline-inverse':
					'border border-input bg-muted-foreground text-muted shadow-sm hover:bg-foreground hover:text-background',
				outline:
					'border border-input bg-transparent shadow-sm hover:bg-foreground hover:text-background',
				'outline-muted':
					'border border-input bg-muted text-foreground shadow-sm hover:bg-foreground hover:text-background',
				secondary:
					'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				green: 'bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-800 text-primary shadow-sm rounded-lg',
				text: 'text-[hsl(46.38 70.61% 48.04%)] hover:text-[hsl(46.38 70.61% 48.04%)] dark:text-[#fad000] dark:hover:text-[#fad000] !p-0 text-base'
			},
			size: {
				default: 'h-9 px-4 py-2',
				xs: 'h-6 rounded-lg px-2 text-xs',
				sm: 'h-8 rounded-lg px-3 text-xs',
				lg: 'h-10 rounded-lg px-8',
				xl: 'h-14 rounded-lg px-10',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	href?: string;
	arrow?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			href,
			onClick,
			arrow,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		const router = useRouter();

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (href) {
				e.preventDefault();
				router.push(href);
			}

			onClick?.(e);
		};

		let arrowIcon = (
			<ArrowIcon
				className={cn(
					'mt-0.5 h-5 w-5',
					arrow === 'left' && '-ml-1 rotate-180',
					arrow === 'right' && '-mr-1'
				)}
			/>
		);

		let inner = (
			<>
				{arrow === 'left' && arrowIcon}
				{arrow === 'right' && arrowIcon}
			</>
		);

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				onClick={handleClick}
				{...props}
			>
				{children}
				{inner}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
