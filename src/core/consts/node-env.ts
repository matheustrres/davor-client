import { type ObjectValues } from '@/core/types';

export const NODE_ENV = {
	development: 'development',
	production: 'production',
} as const;

export type NODE_ENV = ObjectValues<typeof NODE_ENV>;
