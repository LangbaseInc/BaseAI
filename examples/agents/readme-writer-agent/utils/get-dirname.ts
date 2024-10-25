import {dirname} from 'path';
import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
let dirName = dirname(__filename);
dirName = path.join(dirName, '..');

export {dirName};
