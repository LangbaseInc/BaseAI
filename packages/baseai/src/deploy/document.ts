import { buildSingleMemory } from '@/build';
import { heading } from '@/utils/heading';
import { isMemoryDocExist } from '@/utils/memory/check-memory-doc-exists';
import * as p from '@clack/prompts';
import {
	handleDeploymentError,
	handleError,
	handleExistingMemoryDeploy,
	handleInvalidConfig,
	retrieveAuthentication,
	uploadDocumentsToMemory,
	type Account
} from '.';
import path from 'path';
import fs from 'fs/promises';
import { cyan } from '@/utils/formatting';
import { loadMemoryFiles } from '@/utils/memory/load-memory-files';
import { dlog } from '@/dev/utils/dlog';

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

		await buildSingleMemory({ memoryName: validMemoryName });
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

		spinner.stop(`Processed ${documentName} of memory: ${memoryName}`);

		try {
			if (overwrite) {
				await uploadDocumentsToMemory({
					account,
					documents: [document],
					name: memoryObject.name
				});
			}

			if (!overwrite) {
				const hasDeployed = await handleExistingMemoryDeploy({
					account,
					overwrite,
					memory: memoryObject,
					documents: [document],
					runProdSuperSetOfLocal: false
				});

				if (!hasDeployed) {
					p.log.warning(`Document already exists in prod memory.`);
					p.log.info(
						`Please run "npx baseai deploy ${memoryObject.name} -d ${document.name} -o" to overwrite the document.`
					);
					process.exit(1);
				}
			}
		} catch (error) {
			dlog('Error in upsertMemory:', error);
			handleDeploymentError({
				spinner,
				name: memoryName,
				error,
				type: 'memory'
			});
		}
	} catch (error) {
		handleDeploymentError({
			spinner,
			name: memoryName,
			error,
			type: 'memory'
		});
		throw error;
	}
}
