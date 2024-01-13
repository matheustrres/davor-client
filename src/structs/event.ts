import { type ClientEvents } from 'discord.js';

import type DavorClient from './client';

export default abstract class DiscordEvent {
	constructor(
		public readonly client: DavorClient,
		public readonly name: keyof ClientEvents,
	) {}

	abstract run(...args: any[]): Promise<any> | any;
}
