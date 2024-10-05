import {
	User,
	type Interaction,
	type PermissionResolvable,
	type InteractionResponse,
} from 'discord.js';

import { Core } from '@/core';

import DavorClient from '@/structs/client';
import Context from '@/structs/context';
import DiscordEvent from '@/structs/event';

import { resolvePermissions } from '@/utils/resolve-permissions';

export default class InteractionCreateEvent extends DiscordEvent {
	constructor(client: DavorClient) {
		super(client, 'interactionCreate');
	}

	async run(i: Interaction): Promise<InteractionResponse<boolean> | undefined> {
		if (i.isChatInputCommand()) {
			const command = this.client.commands.find(
				(c) => c.name === i.commandName,
			);

			if (command) {
				const { category, permissions } = command;
				const ownerId = Core.getEnvOrThrow('CLIENT_OWNER_ID');

				if (category === 'Dev' && i.user.id !== ownerId) {
					return i.reply({
						ephemeral: true,
						content: 'This command is restricted.',
					});
				}

				if (permissions?.botPerms?.length) {
					const missingPermissions = this.#getMissingPerms<DavorClient>(
						i,
						this.client,
						permissions.botPerms,
					);

					if (missingPermissions) {
						return i.reply({
							ephemeral: true,
							content: `I need the following permissions to run this command: \n\`${missingPermissions}\`.`,
						});
					}
				}

				if (permissions?.memberPerms?.length) {
					const missingPermissions = this.#getMissingPerms<User>(
						i,
						i.user,
						permissions.memberPerms,
					);

					if (missingPermissions) {
						return i.reply({
							ephemeral: true,
							content: `You need the following permissions to run this command: \n\`${permissions}\`.`,
						});
					}
				}

				const context = new Context(i);

				command.run(context);
			}
		}

		return undefined;
	}

	#getMissingPerms<TUser = DavorClient | User>(
		i: Interaction,
		u: TUser,
		permissions: PermissionResolvable[],
	): string | undefined {
		if (u instanceof DavorClient) {
			if (!i.appPermissions?.has(permissions)) {
				return resolvePermissions(permissions);
			}
		}

		if (u instanceof User) {
			if (!i.memberPermissions?.has(permissions)) {
				return resolvePermissions(permissions);
			}
		}

		return undefined;
	}
}
