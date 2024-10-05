import assert from 'assert';
import { loadEnvFile } from 'process';

import { type Environment } from '@/core/types';

export class Core {
	static getEnvOrThrow(envKey: keyof Environment): string {
		this.#loadEnvFile();

		const env = process.env[envKey];
		assert(env, `Missing environment variable "${envKey}".`);

		return env;
	}

	static #loadEnvFile(path = '.env') {
		return loadEnvFile(path);
	}
}
