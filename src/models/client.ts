import { type Document, model, Schema } from 'mongoose';

import { CommandCategory } from '@/core/consts/cmd-category';

import type Command from '@/structs/command';

type CommandSelectedProps = Pick<Command, 'name' | 'category' | 'description'>;

type ClientDoc = Document & {
	discordId: string;
	commands: number;
	lockedCommands: Array<CommandSelectedProps>;
};

const clientSchema = new Schema<ClientDoc>(
	{
		discordId: {
			required: true,
			type: String,
			unique: true,
		},
		commands: {
			type: Number,
			default: 0,
		},
		lockedCommands: {
			type: [
				{
					name: { type: String, required: true, unique: true },
					description: { type: String, required: true },
					category: { type: String, required: true, enum: CommandCategory },
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const ClientDb = model<ClientDoc>('Client', clientSchema);
