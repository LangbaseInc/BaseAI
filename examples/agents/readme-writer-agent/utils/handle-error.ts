import * as p from '@clack/prompts';
type Spinner = ReturnType<typeof p.spinner>;

export async function handleError({
	spinner,
	error,
}: {
	spinner: Spinner;
	error: Error;
}) {
	spinner.stop();
	p.log.error(`ERROR: ${(error as Error).message}`);
	process.exit(1);
}
