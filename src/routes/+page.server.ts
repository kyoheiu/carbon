import * as fs from 'node:fs/promises';
import { toItem } from '$lib/toItem';
import { DATA_PATH } from '$lib/env';

export const prerendered = false;

export const load = async () => {
	const files = await fs.readdir(DATA_PATH, {
		withFileTypes: true
	});
	const names = files.filter((x) => x.isFile()).map((x) => x.name);
	const result = toItem(names);
	result.sort((a, b) => b.modified - a.modified);
	return { result: result };
};
