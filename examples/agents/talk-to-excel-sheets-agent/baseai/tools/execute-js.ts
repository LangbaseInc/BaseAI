import { ToolI } from '@baseai/core';
import * as dfd from "danfojs-node";
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'baseai/memory/talk-to-excel-memory/documents/Sample-Sales-Data.csv');
const XLS_PATH = path.join(process.cwd(), 'baseai/memory/talk-to-excel-memory/Sample-Sales-Data.xlsx');

export async function executeJs({ script }: { script: string }) {
    try {
        // Clean the script by removing import statements
        let cleanedScript = script
            .replace(/import.*?;/g, '')
            .replace(/danfo\./g, 'dfd.')
            .replace(/const XLS_PATH.*?;/g, '');

        // Additional cleaning: remove any semicolons at the end
        cleanedScript = cleanedScript.trim();
        if (!cleanedScript.endsWith(';')) {
            cleanedScript += ';';
        }

        // Validate that cleanedScript is not empty
        if (!cleanedScript) {
            throw new Error('The cleaned script is empty. Please check the generated script.');
        }

        // Create function with dfd and XLS_PATH context
        const scriptFn = new Function('dfd', 'XLS_PATH', `
            return (async () => {
                try {
                    ${cleanedScript}
                } catch (err) {
                    return { error: err.message };
                }
            })();
        `);

        // Execute with dfd and XLS_PATH available
        const result = await scriptFn(dfd, XLS_PATH);
        console.log('Analysis Results:', JSON.stringify(result, null, 2));
        return { result };
        
    } catch (error) {
        console.error('Error during script execution:', error);
        return {
            result: { error: error instanceof Error ? error.message : 'Unknown error during script execution' }
        };
    }
}


const toolExecuteJs = (): ToolI => ({
    run: executeJs,
    type: 'function' as const,
    function: {
        name: 'executeJs',
        description: 'Execute danfo.js script for data analysis on Excel data',
        parameters: {
            type: 'object',
            properties: {
                script: {
                    type: 'string',
                    description: 'The Danfo.js script to execute (dependencies will be provided)'
                }
            },
            required: ['script']
        }
    }
});

export default toolExecuteJs;
