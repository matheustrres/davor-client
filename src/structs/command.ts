import {
	type ApplicationCommandOptionData,
	type PermissionResolvable,
} from 'discord.js';

import type DavorClient from './client';
import type CommandContext from './context';

import { type CommandCategory } from '@/core/consts/cmd-category';

type CommandPermissions = {
	botPerms?: PermissionResolvable[];
	memberPerms?: PermissionResolvable[];
};

type CommandProps = {
	name: string;
	description: string;
	category: CommandCategory;
	options?: ApplicationCommandOptionData[];
	permissions?: CommandPermissions;
};

export default abstract class Command {
	constructor(
		protected readonly client: DavorClient,
		private readonly props: CommandProps,
	) {
		this.props = {
			...props,
			permissions: {
				botPerms: this.props.permissions?.botPerms || [],
				memberPerms: this.props.permissions?.memberPerms || [],
			},
		};
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string {
		return this.props.description;
	}

	get category(): CommandCategory {
		return this.props.category;
	}

	get options(): ApplicationCommandOptionData[] | undefined {
		return this.props.options;
	}

	get permissions(): CommandPermissions | undefined {
		return this.props.permissions;
	}

	abstract run(ctx: CommandContext): Promise<any>;
}
