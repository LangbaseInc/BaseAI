import {isProd} from '../utils/is-prod';

export const logger = (category: any, value?: unknown, logHeader?: string) => {
	if (isProd()) return;

	console.log('');
	if (logHeader) {
		console.log(`======= ${logHeader} =======`);
	}
	console.log(`❯❯ ${category}`);

	if (typeof value === 'object' && value !== null) {
		console.dir(value, {depth: null, colors: true});
	} else if (value !== undefined) {
		console.log(value);
	}
};
