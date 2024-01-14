export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_CLIENT_TOKEN: string;
			DISCORD_CLIENT_GUILD_ID: string;
      DISCORD_CLIENT_OWNER_ID: string;
			NODE_ENV: string;
			TZ: string;
		}
	}
}
