import { buildMemory } from '@/build';
import { heading } from '@/utils/heading';
import { isMemoryDocExist } from '@/utils/memory/check-memory-doc-exists';
import * as p from '@clack/prompts';
import {
	handleDeploymentError,
	handleError,
	handleInvalidConfig,
	listMemoryDocuments,
	retrieveAuthentication,
	uploadDocumentsToMemory,
	type Account
} from '.';
import path from 'path';
import fs from 'fs/promises';
import { cyan } from '@/utils/formatting';
import {
	getMemoryFileNames,
	loadMemoryFiles,
	type MemoryDocumentI
} from '@/utils/memory/load-memory-files';
import type { MemoryI } from 'types/memory';
import { compareDocumentLists } from '@/utils/memory/compare-docs-list';

type Spinner = ReturnType<typeof p.spinner>;

export async function deploySingleDocument({
	memoryName,
	documentName,
	overwrite
}: {
	memoryName: string;
	documentName: string;
	overwrite: boolean;
}) {
	p.intro(heading({ text: 'DEPLOY', sub: 'Deploy a document' }));

	const spinner = p.spinner();
	try {
		const { validDocumentName, validMemoryName } = await isMemoryDocExist({
			spinner,
			memoryName,
			documentName
		});

		spinner.stop('Loaded docs');

		await buildMemory({ memoryName: validMemoryName });
		const buildDir = path.join(process.cwd(), '.baseai');
		const memoryDir = path.join(buildDir, 'memory');

		const account = await retrieveAuthentication({ spinner });
		if (!account) {
			p.outro(
				`No account found. Skipping deployment. \n Run: ${cyan('npx baseai@latest auth')}`
			);
			process.exit(1);
		}

		await deployDocument({
			account,
			spinner,
			memoryDir,
			overwrite,
			memoryName: validMemoryName,
			documentName: validDocumentName
		});

		p.outro(
			heading({ text: 'DEPLOYED', sub: 'successfully', green: true })
		);
	} catch (error) {
		handleError({
			spinner,
			message: 'An unexpected error occurred',
			error
		});
	}
}

async function deployDocument({
	account,
	spinner,
	overwrite,
	memoryDir,
	memoryName,
	documentName
}: {
	account: Account;
	spinner: Spinner;
	memoryDir: string;
	overwrite: boolean;
	memoryName: string;
	documentName: string;
}) {
	const memoryPath = path.join(memoryDir, `${memoryName}.json`);
	try {
		const memoryContent = await fs.readFile(memoryPath, 'utf-8');
		const memoryObject = JSON.parse(memoryContent);

		if (!memoryObject) {
			handleInvalidConfig({ spinner, name: memoryName, type: 'memory' });
			process.exit(1);
		}

		p.log.step(`Processing ${documentName} of memory: ${memoryName}`);
		const memoryDocs = await loadMemoryFiles(memoryName);

		const document = memoryDocs.find(doc => doc.name === documentName);

		if (!document) {
			spinner.stop(
				`Document ${documentName} not found in memory ${memoryName}`
			);
			process.exit(1);
		}

		await handleSingleDocDeploy({
			memory: memoryObject,
			account,
			document,
			overwrite
		});

		spinner.stop(
			`Finished processing document ${documentName} of memory ${memoryName}`
		);
	} catch (error) {
		handleDeploymentError({
			spinner,
			name: memoryName,
			error,
			type: 'memory'
		});
		process.exit(1);
	}
}

export async function handleSingleDocDeploy({
	memory,
	account,
	document,
	overwrite
}: {
	memory: MemoryI;
	account: Account;
	document: MemoryDocumentI;
	overwrite: boolean;
}) {
	p.log.info(
		`Checking "${memory.name}" memory for document "${document.name}".`
	);

	// Fetch the existing documents
	const prodDocs = await listMemoryDocuments({
		account,
		memory
	});

	// Get the list of local document names
	const localDocs = await getMemoryFileNames(memory.name);

	// If overwrite is present, deploy.
	if (overwrite) {
		await uploadDocumentsToMemory({
			account,
			documents: [document],
			name: memory.name
		});
		p.log.success(
			`Document "${document.name}" uploaded to memory "${memory.name}".`
		);
		return;
	}

	// If it is the only that does not exist in prod, deploy.
	const onlyDeployDocMissing = checkOnlyDeployDocumentMissing({
		localDocs,
		prodDocs,
		deployDoc: document.name
	});

	if (onlyDeployDocMissing) {
		await uploadDocumentsToMemory({
			account,
			documents: [document],
			name: memory.name
		});
		p.log.success(
			`Document "${document.name}" uploaded to memory "${memory.name}".`
		);
		return;
	}

	const existInProd = prodDocs.includes(document.name);

	if (existInProd) {
		p.log.info(
			`Document "${document.name}" already exists in memory "${memory.name}".`
		);

		p.log.info(
			`Use the --overwrite flag to overwrite the existing document in memory.\n`
		);
		return;
	}

	// Compare the documents
	const { isProdSupersetOfLocal, areMutuallyExclusive, areOverlapping } =
		compareDocumentLists({
			localDocs,
			prodDocs
		});

	if (isProdSupersetOfLocal || areMutuallyExclusive || areOverlapping) {
		p.log.warning(
			`The documents in memory "${memory.name}" are not in sync with the production memory.`
		);

		p.log.warning(
			`Memory deploy is currently in beta. We only support overwriting the prod memory on Langbase.com.`
		);

		p.log.info(
			`Use the --overwrite flag to overwrite the existing document in memory.\n`
		);
		return;
	}
}

export function checkOnlyDeployDocumentMissing({
	localDocs,
	prodDocs,
	deployDoc
}: {
	localDocs: string[];
	prodDocs: string[];
	deployDoc: string;
}): boolean {
	// Convert arrays to Sets for efficient lookup
	const localDocSet = new Set(localDocs);
	const prodDocSet = new Set(prodDocs);

	// Check if the deployed document is in local but not in prod
	const deployDocMissing =
		localDocSet.has(deployDoc) && !prodDocSet.has(deployDoc);

	// If sizes don't match (excluding deployDoc), sets can't be equal
	if (localDocSet.size !== prodDocSet.size + 1) {
		return false;
	}

	// Check if all docs in prod are in local (excluding deployDoc)
	for (const doc of prodDocSet) {
		if (!localDocSet.has(doc)) {
			return false;
		}
	}

	// At this point, we know:
	// 1. Local has exactly one more doc than prod (deployDoc)
	// 2. All docs in prod are in local
	// Therefore, local and prod are the same except for deployDoc

	return deployDocMissing;
}
