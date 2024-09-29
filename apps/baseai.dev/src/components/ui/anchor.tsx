import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'mxcn';
import Link from 'next/link';
import * as React from 'react';

const anchorVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2 group',
	{
		variants: {
			variant: {
				home: 'bg-white text-black shadow hover:bg-primary/90',
				default:
					'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				'default-reverse':
					'bg-black text-white shadow hover:bg-primary/90 hover:text-black',
				warn: 'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-input bg-transparent shadow-sm hover:bg-foreground hover:text-background',
				'outline-muted':
					'border border-input bg-muted shadow-sm hover:bg-foreground hover:text-background',
				secondary:
					'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				anchor: 'text-primary underline-offset-4 hover:underline',
				green: 'bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-800 text-primary shadow-sm rounded-lg',
				'outline-green':
					'border border-green-700 dark:border-green-900 bg-background shadow-sm text-green-700 dark:text-green-100/50 hover:bg-green-700 hover:dark:bg-green-700 hover:text-white hover:dark:text-white'
			},
			size: {
				home: 'px-16 py-5 rounded-full text-xl',
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export interface AnchorProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof anchorVariants> {
	asChild?: boolean;
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
	({ className, variant, size, asChild = false, href, ...props }, ref) => {
		const Comp = asChild ? Slot : Link;
		return (
			<Comp
				href={href!}
				className={cn(anchorVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Anchor.displayName = 'Anchor';

export { Anchor, anchorVariants };
