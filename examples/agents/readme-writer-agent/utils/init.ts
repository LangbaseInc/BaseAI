import chalk from 'chalk';
import clearConsole from 'clear-any-console';

export function init({clear, title, version, tagLine, description}) {
	clear && clearConsole();
	const bg = chalk.hex('#6CC644').inverse.bold;
	const clr = chalk.hex(`#000000`).bold;

	console.log();
	console.log(
		`${clr(`${bg(` ${title} `)}`)} v${version} ${chalk.dim(tagLine)}\n${chalk.dim(
			description,
		)}`,
	);
	console.log();
}
