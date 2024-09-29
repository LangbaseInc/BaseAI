import { IconWarn } from '../ui/icons/warn';

export function Warn({
	top,
	title,
	children
}: {
	top: boolean;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="light:ring-ring:ring-border relative my-7 rounded-lg py-3.5 pl-[1.625rem] pr-4 ring-1 ring-inset ring-ring/10 [--callout-border:theme(colors.yellow.600)] [--callout-icon:theme(colors.yellow.600)] [--callout-title:theme(colors.yellow.600)] dark:[--callout-border:theme(colors.yellow.500)] dark:[--callout-icon:theme(colors.yellow.600)] dark:[--callout-title:theme(colors.yellow.600)] [&>*]:my-0 [&>*]:py-0">
			<div className="absolute inset-y-2 left-2 flex w-0.5 gap-4 rounded-full bg-[--callout-border]"></div>
			<div className="mb-2 mt-0 flex items-center justify-start gap-1">
				<IconWarn className="h-4 w-4 text-yellow-600" />
				<span className="text-xs font-bold text-[--callout-title]">
					Warning
				</span>
			</div>

			<div className="mt-2 [&>a]:text-yellow-600">
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
