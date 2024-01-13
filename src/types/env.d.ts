export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_CLIENT_TOKEN: string;
			NODE_ENV: string;
			TZ: string;
		}
	}
}
