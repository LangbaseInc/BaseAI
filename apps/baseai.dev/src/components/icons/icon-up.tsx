export function IconUp(props: JSX.IntrinsicElements['svg']) {
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
				d="M12.9715 10.6833C12.3674 10.3477 11.6329 10.3477 11.0289 10.6833L3.48583 14.8739C3.00304 15.1421 2.39424 14.9682 2.12602 14.4854C1.85781 14.0026 2.03176 13.3938 2.51454 13.1256L10.0576 8.93501C11.2657 8.26385 12.7347 8.26385 13.9428 8.93501L21.4858 13.1256C21.9686 13.3938 22.1426 14.0026 21.8743 14.4854C21.6061 14.9682 20.9973 15.1421 20.5145 14.8739L12.9715 10.6833Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export { IconUp as ChevronUpIcon };
