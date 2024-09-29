import { getDocumentProxy, extractText } from 'unpdf';
import * as XLSX from 'xlsx';

/**
 * Retrieves the content of a document.
 *
 * Supported document types:
 * 1- Text files: .txt
 * 2- PDF files: .pdf
 * 3- CSV files: .csv
 * 4- Excel files: .xlsx/.xls
 * 5- Markdown files: .md
 *
 * @param doc - The document to retrieve the content from.
 * @returns A promise that resolves to the content of the document as a string.
 */
export async function getDocumentContent(doc: Blob): Promise<string> {
	// Extract the content from the doc.
	let docType = doc.type;

	// Make text files.
	if (docType.includes('charset')) docType = 'text/plain';

	let content = '';

	// Process content based on document type.
	if (docType === 'text/plain') {
		content = await processTextFile(doc);
	} else if (docType === 'application/pdf') {
		content = await processPdfFile(doc);
	} else if (docType === 'text/csv') {
		content = await processCsvFile(doc);
	} else if (docType.includes('application/vnd')) {
		/***
		 * 'application/vnd.ms-excel' -> .xls
		 * 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' -> .xlsx
		 */
		content = await processXlsFile(doc);
	} else {
		content = await processMarkdownFile(doc);
	}

	// Remove emojis from the content.
	content = removeEmojis(content);

	return content;
}

/**
 * Processes a text file and returns its content as a string.
 *
 * @param doc - The text file to be processed.
 * @returns A promise that resolves to the content of the text file as a string.
 */
async function processTextFile(doc: Blob): Promise<string> {
	return await doc.text();
}

/**
 * Processes a PDF file and extracts its content as a string.
 *
 * @param doc - The PDF file to process.
 * @returns A promise that resolves to the extracted content as a string.
 */
async function processPdfFile(doc: Blob): Promise<string> {
	const pdfDocument = await getDocumentProxy(await doc.arrayBuffer());
	const { text } = await extractText(pdfDocument, {
		mergePages: true
	});
	return typeof text === 'string' ? text : (text as string[]).join('\n');
}

/**
 * Processes a CSV file and returns its content as a string.
 *
 * @param doc - The CSV file to be processed.
 * @returns A promise that resolves to the content of the CSV file as a string.
 */
async function processCsvFile(doc: Blob): Promise<string> {
	const content = await doc.text();
	return processCSV(content);
}

/**
 * Processes an XLS file and returns its content as a string.
 * (Supports both .xls and .xlsx files)
 *
 * @param doc - The XLS file to process.
 * @returns A promise that resolves to the content of the XLS file as a string.
 */
async function processXlsFile(doc: Blob): Promise<string> {
	// Read the Excel file as an array buffer
	const arrayBuffer = await doc.arrayBuffer();

	// Parse the Excel file
	const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

	// Content
	let content = '';
	// Traverse all the sheets in the workbook
	// and process the content of each sheet and append it to the final content.

	for (const sheetName of workbook.SheetNames) {
		// Get the content of the sheet
		const worksheet = workbook.Sheets[sheetName];
		// Convert the sheet to CSV
		const csvContent = XLSX.utils.sheet_to_csv(worksheet);
		// Process
		const processedContent = processCSV(csvContent);
		// Append the processed content to the final content
		content += processedContent + '\n\n';
	}

	// Return the final content
	return content;
}

/**
 * Processes a markdown file and returns its content as a string.
 *
 * @param doc - The markdown file to process.
 * @returns A promise that resolves to the content of the markdown file as a string.
 */
async function processMarkdownFile(doc: Blob): Promise<string> {
	return await doc.text();
}

/**
 * Removes emojis from the given content.
 *
 * @param content - The content from which emojis should be removed.
 * @returns The content with emojis removed.
 */
function removeEmojis(content: string): string {
	return content.replace(
		/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
		''
	);
}

/**
 * Processes the content of a CSV file and returns the processed content.
 *
 * The processed content is a string where each row is prepended with the header row.
 *
 * @param csvContent - The content of the CSV file as a string.
 * @returns The processed content of the CSV file.
 */
function processCSV(csvContent: string): string {
	// Split the content into rows
	const rows = csvContent.split('\n');

	// Extract the header row
	const header = rows[0].replace('\r', '');

	// Process each data row and join them into a single string
	const processedContent = rows
		.slice(1)
		.map(row => {
			// Skip empty rows and rows with only commas
			if (row.trim() === '' || /^[,]+$/.test(row.trim())) {
				return '';
			}
			return header + '\n' + row;
		})
		.join('\n\n');

	return processedContent;
}
