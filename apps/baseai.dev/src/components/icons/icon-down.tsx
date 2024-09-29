export function IconDown(props: JSX.IntrinsicElements['svg']) {
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
				d="M2.12602 9.51454C2.39424 9.03176 3.00304 8.85781 3.48583 9.12602L11.0289 13.3166C11.6329 13.6522 12.3674 13.6522 12.9715 13.3166L20.5145 9.12602C20.9973 8.85781 21.6061 9.03176 21.8743 9.51454C22.1426 9.99732 21.9686 10.6061 21.4858 10.8743L13.9428 15.0649C12.7347 15.7361 11.2657 15.7361 10.0576 15.0649L2.51454 10.8743C2.03176 10.6061 1.85781 9.99732 2.12602 9.51454Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export { IconDown as ChevronDownIcon };
