import { resolve } from 'node:path';

import { addAlias } from 'module-alias';

import { Core } from '../core';

const isProduction = Core.getEnvOrThrow('NODE_ENV');

const rootPath = isProduction
	? resolve(__dirname, '../')
	: resolve(__dirname, '../../src');

addAlias('@', rootPath);
