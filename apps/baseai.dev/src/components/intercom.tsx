'use client';

import Intercom from '@intercom/messenger-js-sdk';
import { useEffect } from 'react';

const IntercomClient = () => {
	useEffect(() => {
		// Initialize Intercom.
		initializeIntercom();
	}, []);

	const initializeIntercom = () => {
		// Check if app id exists.
		if (!process.env.NEXT_PUBLIC_INTERCOM_APP_ID) {
			return;
		}

		Intercom({
			app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
			source: 'BaseAI',
			created_at: new Date().getTime(),
		});
	};

	return <></>;
};

export default IntercomClient;
