import fs from 'node:fs';
import path from 'node:path';

import type DavorClient from '@/structs/client';

type LoadResourcesProps<T> = {
	client: DavorClient;
	resource: T[];
	path: string;
};

export const loadResources = <T = unknown>(
	props: LoadResourcesProps<T>,
): T[] => {
	const root = path.resolve(__dirname, '..');
	const baseDir = path.join(root, props.path);

	const directories = fs.readdirSync(baseDir);

	for (const directory of directories) {
		const dirPath = path.join(baseDir, directory);

		const resources = fs
			.readdirSync(dirPath)
			.filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

		for (const resource of resources) {
			const resolvedPath = path.join(dirPath, resource);

			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const Resource = require(resolvedPath).default;
			const res = new Resource(props.client) as T;

			props.resource.push(res);
		}
	}

	return props.resource;
};
