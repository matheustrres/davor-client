import {
	type GuildMember,
	type ChatInputCommandInteraction,
	type Guild,
	type TextBasedChannel,
	type APIInteractionGuildMember,
	type User,
	type InteractionReplyOptions,
} from 'discord.js';

import type DavorClient from './client';

export default class Context {
	constructor(
		private readonly client: DavorClient,
		private readonly interaction: ChatInputCommandInteraction,
	) {}

	get channel(): TextBasedChannel | null {
		return this.interaction.channel;
	}

	get guild(): Guild | null {
		return this.interaction.guild;
	}

	get member(): GuildMember | APIInteractionGuildMember | null {
		return this.interaction.member;
	}

	get user(): User {
		return this.interaction.user;
	}

	async reply(opts: InteractionReplyOptions) {
		if (!opts.content) opts.content = '';

		return this.interaction.deferred
			? await this.interaction.editReply(opts)
			: await this.interaction.reply(opts);
	}
}
