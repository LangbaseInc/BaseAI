import {ApiErrorZod, ErrorCodesType} from './errors';

async function validate({
	schema,
	input,
	code = `BAD_REQUEST`,
	message,
}: {
	schema: any;
	input: any;
	code?: ErrorCodesType;
	message?: string;
}) {
	const result = await schema.safeParseAsync(input);
	ApiErrorZod.handle({code, result, message});

	// Since ApiError.handle throws, TypeScript may not infer that execution ends above
	// and result.data is now avaiable.
	// @ts-ignore - TS doesn't know that the function ends above.
	return result.data; // Return the validated data
}

export default validate;
