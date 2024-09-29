export function IconStream(
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
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 5H22V7H2V5ZM2 11H22V13H2V11ZM2 17H12V19H2V17Z"
				fill="currentColor"
			/>
		</svg>
	);
}
