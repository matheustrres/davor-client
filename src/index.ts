import './utils/module-alias';

import { Core } from '@/core';

import DavorClient from '@/structs/client';

export default (async () => {
	const token = Core.getEnvOrThrow('CLIENT_TOKEN');
	const client = new DavorClient();
	await client.login(token);
})();
