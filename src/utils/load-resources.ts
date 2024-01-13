import fs from 'node:fs';
import path from 'node:path';

import type DavorClient from '@/structs/client';

type LoadResourcesProps<T> = {
	client: DavorClient;
	resource: T[];
	path: string;
};

export const loadResources = <T>(props: LoadResourcesProps<T>): T[] => {
	const root = path.resolve(__dirname, '..');
	const dirs = fs.readdirSync(path.join(root, props.path));

	for (const dir of dirs) {
		const resources = fs.readdirSync(`${root}/${props.path}/${dir}`);

		for (const resource of resources) {
			if (resource.endsWith('.js') || resource.endsWith('.ts')) {
				const resolvedPath = path.resolve(
					`${root}/${props.path}/${dir}/${resource}`,
				);

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const Resource = require(resolvedPath).default;
				const res = new Resource(props.client) as T;

				props.resource.push(res);
			}
		}
	}

	return props.resource;
};
