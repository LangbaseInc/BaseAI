export function IconStoreMessages(
	props: JSX.IntrinsicElements['svg']
) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path d="M11 8V5H9V8H11Z" fill="currentColor" />
			<path d="M15 5V8H13V5H15Z" fill="currentColor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19 2H5V9H3V22H21V9H19V2ZM17 9V4H7V9H17Z"
				fill="currentColor"
			/>
		</svg>
	);
}
