import DavorClient from './structs/client';

export default (async () => {
	const client = new DavorClient();

	await client.login(process.env.DISCORD_CLIENT_TOKEN);
})();
