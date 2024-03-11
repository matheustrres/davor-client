import { Client, type ClientEvents } from 'discord.js';

import type Command from './command';
import type DiscordEvent from './event';

import { loadResources } from '@/utils/load-resources';

export default class DavorClient extends Client {
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
			path: 'commands',
		});

		console.info(`${commands.length} commands loaded.`);
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

		console.info(`${events.length} events loaded.`);
	}

	async loadSlashCommands(): Promise<void> {
		if (!this.commands.length) {
			throw new Error('No commands have been loaded yet.');
		}

		try {
			await this.guilds.cache
				.get(process.env.DISCORD_CLIENT_GUILD_ID)
				?.commands.set(this.commands);
		} catch (error) {
			console.error(
				`Error while registering Application (/) commands: \n${error}`,
			);
		}
	}

	async login(token?: string | undefined): Promise<string> {
		return super.login(token);
	}
}
