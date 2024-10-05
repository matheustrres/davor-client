import './utils/module-alias';

import { Core } from '@/core';

import DavorClient from '@/structs/client';

export default (async () => {
	const client = new DavorClient();

	await client.login(Core.getEnvOrThrow('CLIENT_TOKEN'));
})();
