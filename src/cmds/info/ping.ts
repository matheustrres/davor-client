import { type InteractionResponse, type Message } from 'discord.js';

import type DavorClient from '@/structs/client';
import Command from '@/structs/command';
import type Context from '@/structs/context';

export default class PingCommand extends Command {
	constructor(client: DavorClient) {
		super(client, {
			name: 'ping',
			description: 'Check client latency',
			category: 'Info',
		});
	}

	async run(ctx: Context): Promise<Message | InteractionResponse> {
		const ping = this.client.ws.ping;

		return ctx.reply({
			content: `Current latency is \`${ping}ms\`.`,
			fetchReply: true,
		});
	}
}
