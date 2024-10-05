import { type NODE_ENV } from '@/core/consts/node-env';

export type ObjectValues<T> = T[keyof T];

export type Environment = {
	NODE_ENV: NODE_ENV;
	CLIENT_TOKEN: string;
	CLIENT_GUILD_ID: string;
	CLIENT_OWNER_ID: string;
	DATABASE_URL: string;
};
