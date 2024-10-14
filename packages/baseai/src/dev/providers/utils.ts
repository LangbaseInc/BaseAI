import type { ErrorResponse } from 'types/providers';

export const generateInvalidProviderResponseError: (
	response: Record<string, any>,
	provider: string
) => ErrorResponse = (response, provider) => {
	return {
		error: {
			message: `Invalid response received from ${provider}: ${JSON.stringify(response)}`,
			type: null,
			param: null,
			code: null
		},
		provider: provider
	} as ErrorResponse;
};

export const generateErrorResponse: (
	errorDetails: {
		message: string;
		type: string | null;
		param: string | null;
		code: string | null;
	},
	provider: string
) => ErrorResponse = ({ message, type, param, code }, provider) => {
	return {
		error: {
			message: `${message}`,
			type: type ?? null,
			param: param ?? null,
			code: code ?? null
		},
		provider: provider
	} as ErrorResponse;
};

const fileExtensionMimeTypeMap = {
	mp4: 'video/mp4',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	bmp: 'image/bmp',
	tiff: 'image/tiff',
	webp: 'image/webp',
	pdf: 'application/pdf',
	mp3: 'audio/mp3',
	wav: 'audio/wav',
	txt: 'text/plain',
	mov: 'video/mov',
	mpeg: 'video/mpeg',
	mpg: 'video/mpg',
	avi: 'video/avi',
	wmv: 'video/wmv',
	mpegps: 'video/mpegps',
	flv: 'video/flv'
};

export const getMimeType = (url: string): string | undefined => {
	const urlParts = url.split('.');
	const extension = urlParts[
		urlParts.length - 1
	] as keyof typeof fileExtensionMimeTypeMap;
	const mimeType = fileExtensionMimeTypeMap[extension];
	return mimeType;
};
