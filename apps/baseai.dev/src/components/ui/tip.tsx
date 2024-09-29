'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import cn from 'mxcn';
import React from 'react';

export default function Tip({
	icon,
	asChild,
	content,
	children,
	className,
	show = true
}: {
	icon?: boolean;
	asChild?: boolean;
	className?: string;
	content: React.ReactNode | string;
	children: React.ReactNode;
	show?: boolean;
}) {
	if (!show) return <>{children}</>;
	return (
		<TooltipProvider delayDuration={50}>
			<Tooltip>
				<TooltipTrigger
					className={cn(
						icon && `flex shrink-0 gap-1 items-center`,
						className
					)}
					asChild={asChild}
				>
					{asChild ? (
						<span className="cursor-pointer">
							{icon && (
								<InformationCircleIcon className="size-5 self-center" />
							)}
							{children}
						</span>
					) : (
						<>
							{icon && (
								<InformationCircleIcon className="size-5 self-center" />
							)}
							{children}
						</>
					)}
				</TooltipTrigger>
				<TooltipContent className="max-w-sm whitespace-pre-wrap">
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function TipCode({ children }: { children: React.ReactNode }) {
	return (
		<code className="bg-muted/30 rounded-lg text-background px-1 py-1/2">
			{children}
		</code>
	);
}
