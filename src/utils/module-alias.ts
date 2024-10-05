import { resolve } from 'node:path';

import { addAlias } from 'module-alias';

const isProduction = process.env.NODE_ENV === 'production';

const rootPath = isProduction
	? resolve(__dirname, '../')
	: resolve(__dirname, '../../src');

addAlias('@', rootPath);
