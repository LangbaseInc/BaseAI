import color from 'picocolors';

export function heading({
	text,
	sub,
	dim,
	green
}: {
	text: string;
	sub?: string;
	dim?: boolean;
	green?: boolean;
}) {
	if (green) {
		return `${color.bgGreen(color.black(` ${text} `))} ${sub && sub}`;
	}
	if (dim) {
		return `${color.bgBlack(color.white(` ${text} `))} ${sub && sub}`;
	}
	return `${color.bold(color.bgCyan(color.black(` ${text} `)))} ${sub && sub}`;
}
