import util from 'node:util';

import {
	ApplicationCommandOptionType,
	codeBlock,
	type InteractionReplyOptions,
} from 'discord.js';

import { Core } from '@/core';

import type DavorClient from '@/structs/client';
import Command from '@/structs/command';
import type Context from '@/structs/context';
import { Logger } from '@/structs/logger';

export default class EvalCommand extends Command {
	readonly #logger = new Logger(EvalCommand.name);

	constructor(client: DavorClient) {
		super(client, {
			name: 'eval',
			description: 'Evaluate a command in Javascript',
			category: 'Dev',
			options: [
				{
					name: 'code',
					description: 'Code to be executed',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'ephemeral',
					description: 'Whether the result is ephemeral or not',
					type: ApplicationCommandOptionType.Boolean,
					required: false,
				},
			],
		});
	}

	#formatText(text: string): string {
		if (typeof text === 'string') {
			const token = Core.getEnvOrThrow('CLIENT_TOKEN');

			text
				.slice(0, 3000)
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(token, 'gi'), '****');
		}

		return text;
	}

	async run(ctx: Context) {
		const code = ctx.interaction.options.getString('code', true);
		const ephemeral = ctx.interaction.options.getBoolean('ephemeral', false);

		let response: InteractionReplyOptions;
		let result: string;

		try {
			const start = process.hrtime();

			let evalued = eval(code);

			if (evalued instanceof Promise) {
				evalued = await evalued;
			}

			const stop = process.hrtime(start);
			const executionTime = (stop[0] * 1e9 + stop[1]) / 1e6;

			const formattedResult = this.#formatText(
				util.inspect(evalued, {
					depth: 0,
				}),
			);

			result = codeBlock(formattedResult);

			if (result.length >= 4000) {
				this.#logger.info(`Result from eval: ${result}`);

				response = {
					ephemeral: true,
					content: 'Result sent to the console.',
				};
			} else {
				response = {
					ephemeral: ephemeral || false,
					content: `Executed in: ${executionTime > 1 ? `${executionTime}ms` : `${(executionTime * 1e3).toFixed(3)}μs`} \n${result}`,
				};
			}
		} catch (error) {
			this.#logger.error(`An error has been found: ${error}`);
			result = (error as Error).message;
		}

		await ctx.reply(response!);
	}
}
