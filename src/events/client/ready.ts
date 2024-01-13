import type DavorClient from '@/structs/client';
import DiscordEvent from '@/structs/event';

export default class ReadyEvent extends DiscordEvent {
	constructor(client: DavorClient) {
		super(client, 'ready');
	}

	async run(): Promise<void> {
		console.log(
			`🚀 ${this.client.user?.tag} successfully connected to Discord API.`,
		);
	}
}
