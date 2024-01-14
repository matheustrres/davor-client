import {
	User,
	type Interaction,
	type PermissionResolvable,
	type InteractionResponse,
} from 'discord.js';

import DavorClient from '@/structs/client';
import Context from '@/structs/context';
import DiscordEvent from '@/structs/event';

import { resolvePermissions } from '@/utils/resolve-permissions';

export default class InteractionCreateEvent extends DiscordEvent {
	constructor(client: DavorClient) {
		super(client, 'interactionCreate');
	}

	async run(
		interaction: Interaction,
	): Promise<InteractionResponse<boolean> | undefined> {
		if (interaction.isChatInputCommand()) {
			const cmd = this.client.commands.find(
				(c) => c.name === interaction.commandName,
			);

			if (cmd) {
				const { category, permissions } = cmd;

				if (
					category === 'Dev' &&
					interaction.user.id !== process.env.DISCORD_CLIENT_OWNER_ID
				) {
					return interaction.reply({
						ephemeral: true,
						content: 'This command is restricted.',
					});
				}

				if (permissions?.botPerms?.length) {
					const missingPermissions = this.#getMissingPerms<DavorClient>(
						interaction,
						this.client,
						permissions.botPerms,
					);

					if (missingPermissions) {
						return interaction.reply({
							ephemeral: true,
							content: `I need the following permissions to run this command: \n\`${missingPermissions}\`.`,
						});
					}
				}

				if (permissions?.memberPerms?.length) {
					const missingPermissions = this.#getMissingPerms<User>(
						interaction,
						interaction.user,
						permissions.memberPerms,
					);

					if (missingPermissions) {
						return interaction.reply({
							ephemeral: true,
							content: `You need the following permissions to run this command: \n\`${permissions}\`.`,
						});
					}
				}

				const context = new Context(interaction);

				cmd.run(context);
			}
		}

		return undefined;
	}

	#getMissingPerms<TUser = DavorClient | User>(
		i: Interaction,
		u: TUser,
		cmdPermissions: PermissionResolvable[],
	): string | undefined {
		if (u instanceof DavorClient) {
			if (!i.appPermissions?.has(cmdPermissions)) {
				return resolvePermissions(cmdPermissions);
			}
		}

		if (u instanceof User) {
			if (!i.memberPermissions?.has(cmdPermissions)) {
				return resolvePermissions(cmdPermissions);
			}
		}

		return undefined;
	}
}
