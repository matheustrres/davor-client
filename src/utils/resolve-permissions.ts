import { type PermissionResolvable, PermissionsBitField } from 'discord.js';

export const resolvePermissions = (permissions: PermissionResolvable[]): string =>
	new PermissionsBitField(permissions).toArray().join(', ');
