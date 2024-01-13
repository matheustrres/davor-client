import { Client } from 'discord.js';

export default class DavorClient extends Client {
	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 2565,
		});
	}

	async login(token?: string | undefined): Promise<string> {
		return super.login(token);
	}
}
