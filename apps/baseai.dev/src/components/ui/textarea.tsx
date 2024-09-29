import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					// 'flex min-h-[60px] w-full rounded-lg border-0 bg-transparent px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-ring/10 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					'block bg-muted w-full rounded-lg border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-ring/5 placeholder:text-muted-foreground focus:ring-1 focus:ring-inset focus:ring-ring/50 sm:text-sm sm:leading-6',
					'shadow-inner bg-muted focus:ring-1 focus:ring-inset focus:ring-muted-foreground/25 placeholder:text-muted-foreground/50',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };
