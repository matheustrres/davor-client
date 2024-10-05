import './utils/module-alias';

import { Database } from './database';

import { Core } from '@/core';

import DavorClient from '@/structs/client';

export default (async () => {
	await Database.connect();

	const token = Core.getEnvOrThrow('CLIENT_TOKEN');
	const client = new DavorClient();
	await client.login(token);
})();
