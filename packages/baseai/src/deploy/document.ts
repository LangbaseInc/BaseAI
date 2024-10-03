import { buildSingleMemory } from '@/build';
import { heading } from '@/utils/heading';
import { isMemoryDocExist } from '@/utils/memory/check-memory-doc-exists';
import * as p from '@clack/prompts';
import {
	handleDeploymentError,
	handleError,
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
	documentName
}: {
	memoryName: string;
	documentName: string;
}) {
	p.intro(heading({ text: 'DEPLOY', sub: 'Deploy a single document' }));

	const spinner = p.spinner();
	try {
		const { validDocumentName, validMemoryName } = await isMemoryDocExist({
			spinner,
			memoryName,
			documentName
		});

		spinner.stop();

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
	spinner,
	memoryDir,
	memoryName,
	documentName,
	account
}: {
	memoryDir: string;
	spinner: Spinner;
	memoryName: string;
	documentName: string;
	account: Account;
}) {
	const memoryPath = path.join(memoryDir, `${memoryName}.json`);
	spinner.start(`Processing memory: ${documentName}`);
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
			await uploadDocumentsToMemory({
				documents: [document],
				name: memoryObject.name,
				account
			});
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
