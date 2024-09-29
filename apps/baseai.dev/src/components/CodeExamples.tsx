'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

type CodeExampleProps = {
	children: React.ReactNode;
};

export function CodeExamples({ children }: CodeExampleProps) {
	const [activeChildIdx, setActiveChildIdx] = useState(0);

	// Convert children to an array
	const childrenArray = React.Children.toArray(children);

	// Use index for identifying active child instead of title search.
	const handleActiveCodeBlock = (index: number) => {
		setActiveChildIdx(index);
	};

	return (
		<div>
			<div className="isolate grid w-full auto-rows-auto grid-cols-4 rounded-md shadow-sm">
				{childrenArray.map((child: any, index: number) => (
					<div
						className={clsx(
							'group relative inline-flex w-full min-w-[100px] items-center justify-center bg-muted px-2 py-1 text-center text-[12px] font-semibold uppercase tracking-wide ring-1 ring-inset ring-muted-foreground/5 transition-colors hover:cursor-pointer hover:bg-foreground hover:text-background focus:z-10 focus:outline ',
							activeChildIdx === index
								? 'bg-muted-foreground text-background'
								: 'text-muted-foreground',
							index === 0 && 'rounded-tl-md rounded-bl-md',
							index === childrenArray.length - 1 &&
								'rounded-tr-md rounded-br-md'
						)}
						key={child.props.exampleTitle}
						onClick={() => handleActiveCodeBlock(index)}
					>
						<span>{child.props.exampleTitle}</span>
					</div>
				))}
			</div>
			{childrenArray[activeChildIdx]}
		</div>
	);
}
