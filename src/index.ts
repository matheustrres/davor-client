import './utils/module-alias';

import { Database } from './database';

import { Core } from '@/core';

import DavorClient from '@/structs/client';
import { Logger } from '@/structs/logger';

const logger = new Logger(DavorClient.name);

enum ExitStatus {
	FAILURE = 1,
	SUCCESS = 0,
}

process.on('unhandledRejection', (reason, promise): void => {
	logger.error(
		`Exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
	);
	throw reason;
});

process.on('uncaughtException', (error: Error): void => {
	logger.error(`Exiting due to an uncaught exception: ${error}`);
	process.exit(ExitStatus.FAILURE);
});

export default (async () => {
	try {
		await Database.connect();

		const token = Core.getEnvOrThrow('CLIENT_TOKEN');
		const client = new DavorClient();
		await client.login(token);

		const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

		for (const exitSignal of exitSignals) {
			process.on(exitSignal, async (): Promise<void> => {
				try {
					await client.destroy();
					logger.info(`Exited successfully.`);
					process.exit(ExitStatus.SUCCESS);
				} catch (error) {
					logger.error(`Exited with an error: ${error}`);
					process.exit(ExitStatus.FAILURE);
				}
			});
		}
	} catch (error) {
		logger.error(`Exited with an error: ${error}`);
		process.exit(ExitStatus.FAILURE);
	}
})();
