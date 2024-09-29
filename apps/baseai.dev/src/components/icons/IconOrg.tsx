import { forwardRef } from 'react';

// Defining PropsType for better readability
type PropsType = JSX.IntrinsicElements['svg'];

export const IconOrg = forwardRef<SVGSVGElement, PropsType>((props, ref) => {
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
				d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM14 11.75C15.2426 11.75 16.25 10.7426 16.25 9.5C16.25 8.25736 15.2426 7.25 14 7.25C12.7574 7.25 11.75 8.25736 11.75 9.5C11.75 10.7426 12.7574 11.75 14 11.75ZM12 20C13.1739 20 14.2887 19.7472 15.293 19.293L8.00002 12L4.70703 15.293C5.9623 18.0687 8.75562 20 12 20Z"
				fill="currentColor"
			/>
		</svg>
	);
});

// Assigning displayName to the component
IconOrg.displayName = 'IconOrg';
