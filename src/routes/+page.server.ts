import * as fs from 'node:fs/promises';
import { toItem } from '$lib/toItem';

export const prerendered = false;

export const load = async () => {
	const files = await fs.readdir('./data', {
		withFileTypes: true
	});
	const names = files.filter((x) => x.isFile()).map((x) => x.name);
	let result = toItem(names);
	result.sort((a, b) => b.modified - a.modified);
	return { result: result };
};
