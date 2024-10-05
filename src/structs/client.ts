import { Client, type ClientEvents } from 'discord.js';

import type Command from './command';
import type DiscordEvent from './event';
import { Logger } from './logger';

import { Core } from '@/core';

import { loadResources } from '@/utils/load-resources';

export default class DavorClient extends Client {
	#logger = new Logger(DavorClient.name);

	commands: Command[];
	events: DiscordEvent[];

	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 2565,
		});

		this.events = [];
		this.commands = [];

		this.#loadCommands();
		this.#loadEvents();
	}

	#loadCommands(): void {
		const commands = loadResources<Command>({
			client: this,
			resource: this.commands,
			path: 'cmds',
		});

		this.#logger.info(`${commands.length} commands loaded.`);
	}

	#loadEvents(): void {
		const events = loadResources<DiscordEvent>({
			client: this,
			resource: this.events,
			path: 'events',
		});

		for (const event of events) {
			if (event.name === 'ready') {
				super.once<keyof ClientEvents>('ready', (...args: any[]) =>
					event.run(...args),
				);
			} else {
				super.on<keyof ClientEvents>(event.name, (...args: any[]) =>
					event.run(...args),
				);
			}
		}

		this.#logger.info(`${events.length} events loaded.`);
	}

	async loadSlashCommands(): Promise<void> {
		if (!this.commands.length) {
			throw new Error('No commands have been loaded yet.');
		}

		try {
			const guildId = Core.getEnvOrThrow('CLIENT_GUILD_ID');

			await this.guilds.cache.get(guildId)?.commands.set(this.commands);
		} catch (error) {
			this.#logger.error(
				`Error while registering Application (/) commands: \n${error}`,
			);
		}
	}

	async login(token?: string | undefined): Promise<string> {
		return super.login(token);
	}
}
