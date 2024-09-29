import cn from 'mxcn';
import { IconInfo } from '../ui/icons/info';

export function Note({
	sub,
	title,
	className,
	children
}: {
	sub?: string;
	className?: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				'light:ring-ring:ring-border relative my-7 rounded-lg py-3.5 pl-[1.625rem] pr-4 ring-1 ring-inset ring-ring/10 [--callout-border:theme(colors.indigo.400)] [--callout-icon:theme(colors.indigo.400)] [--callout-title:theme(colors.indigo.400)] dark:[--callout-border:theme(colors.indigo.400)] dark:[--callout-icon:theme(colors.indigo.400)] dark:[--callout-title:theme(colors.indigo.400)] [&>*]:my-0 [&>*]:py-0',
				className
			)}
		>
			<div className="absolute inset-y-2 left-2 w-0.5 rounded-full bg-[--callout-border]"></div>
			<div className="mb-2 mt-0 flex items-center justify-start gap-1">
				<IconInfo className="h-4 w-4 text-indigo-400" />
				<span className="text-xs font-medium text-[--callout-title]">
					{sub || 'Note'}
				</span>
			</div>

			<div className="mt-2 [&>a]:text-indigo-400">
				{title && (
					<h4 className="mt-4 flex items-center justify-start gap-4 font-bold text-foreground">
						<strong>{title}</strong>
					</h4>
				)}
				<div className="mt-0 flex flex-col gap-4 [&>p]:my-0 [&>p]:py-0">
					{children}
				</div>
			</div>
		</div>
	);
}
