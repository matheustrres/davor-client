import type DavorClient from '@/structs/client';
import DiscordEvent from '@/structs/event';
import { Logger } from '@/structs/logger';

export default class ReadyEvent extends DiscordEvent {
	readonly #logger = new Logger(ReadyEvent.name);

	constructor(client: DavorClient) {
		super(client, 'ready');
	}

	async run(): Promise<void> {
		await this.client.loadSlashCommands();

		this.#logger.info(
			`🚀 ${this.client.user?.tag} successfully connected to Discord API.`,
		);
	}
}
