import { type ObjectValues } from '@/core/types';

export const CommandCategory = {
	Dev: 'Dev',
	Info: 'Info',
	Mod: 'Mod',
	Others: 'Others',
} as const;

export type CommandCategory = ObjectValues<typeof CommandCategory>;
