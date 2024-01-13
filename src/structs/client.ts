import { Client, type ClientEvents } from 'discord.js';

import { loadResources } from '@/utils/load-resources';

import type DiscordEvent from './event';

export default class DavorClient extends Client {
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

		this.#loadEvents();
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
	}

	async login(token?: string | undefined): Promise<string> {
		return super.login(token);
	}
}
