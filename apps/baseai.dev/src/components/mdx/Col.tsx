import clsx from 'clsx';

export function Col({
	children,
	sticky = false
}: {
	children: React.ReactNode;
	sticky?: boolean;
}) {
	return (
		<div
			className={clsx(
				'[&>:first-child]:mt-0 [&>:last-child]:mb-0',
				sticky && 'xl:sticky xl:top-24'
			)}
		>
			{children}
		</div>
	);
}
