import chalk from 'chalk';
import Table from 'cli-table3';
import * as p from '@clack/prompts';

/**
 * Prints a diff table comparing localDocs and prodDocs.
 * 
 * @param localDocs - The array of local documents.
 * @param prodDocs - The array of production documents.
 */
export function printDiffTable(localDocs: string[], prodDocs: string[]) {
	const allItems = new Set([...localDocs, ...prodDocs]);
	const tableData = Array.from(allItems).map(item => [
		localDocs.includes(item) ? item : '',
		prodDocs.includes(item) ? item : ''
	]);

	const table = new Table({
		head: [chalk.cyan('Local'), chalk.cyan('Prod')],
		chars: {
			top: '═',
			'top-mid': '╤',
			'top-left': '╔',
			'top-right': '╗',
			bottom: '═',
			'bottom-mid': '╧',
			'bottom-left': '╚',
			'bottom-right': '╝',
			left: '║',
			'left-mid': '╟',
			mid: '─',
			'mid-mid': '┼',
			right: '║',
			'right-mid': '╢',
			middle: '│'
		}
	});

	tableData.forEach(row => table.push(row));

	p.log.message(`Prod and local are out of sync.`);
	p.log.message(`\n${table.toString()}`);
}
