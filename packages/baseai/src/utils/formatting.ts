import figures from 'figures';
import pc from 'picocolors';

export const color = {
	info: pc.cyan,
	success: pc.green,
	warning: pc.yellow,
	error: pc.red,
	green: pc.green,
	red: pc.red,
	yellow: pc.yellow,
	cyan: pc.cyan,
	blue: pc.blue,
	magenta: pc.magenta,
	white: pc.white,
	gray: pc.gray,
	dim: pc.dim,
	bold: pc.bold
};

export const dimItalic = (text: string) => pc.italic(pc.dim(text));
export const dim = pc.dim;
export const bold = pc.bold;
export const underline = pc.underline;
export const italic = pc.italic;
export const inverse = pc.inverse;
export const hidden = pc.hidden;
export const strikethrough = pc.strikethrough;
export const reset = pc.reset;
export const black = pc.black;
export const red = pc.red;
export const green = pc.green;
export const yellow = pc.yellow;
export const blue = pc.blue;
export const magenta = pc.magenta;
export const cyan = pc.cyan;
export const white = pc.white;
export const gray = pc.gray;
export const oneSpaced = ` `;
export const twoSpaced = `  `;
export const threeSpaced = `   `;
export const fourSpaced = `    `;
export const newLine = `\n`;

export const pad = (n: number): string => {
	return ' '.repeat(n);
};

export const lineItem = pc.dim(`${figures.lineUpDownRight} `);
