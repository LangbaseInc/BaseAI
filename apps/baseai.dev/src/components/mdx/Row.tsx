export function Row({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
			{children}
		</div>
	);
}
