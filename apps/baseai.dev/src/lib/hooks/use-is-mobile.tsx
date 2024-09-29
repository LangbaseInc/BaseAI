import { MOBILE_BREAKPOINT } from '@/data';
import { useEffect, useState } from 'react';

// Breakpoint for mobile screens

/**
 * Custom hook that returns a boolean indicating whether the current device is a mobile device.
 * It listens for window resize events and updates the value accordingly.
 *
 * @returns {boolean} - A boolean value indicating whether the current device is a mobile device.
 */
function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		function handleResize() {
			const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT;
			setIsMobile(isMobileDevice);
		}

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures effect runs only on mount and unmount

	return isMobile;
}

export default useIsMobile;
