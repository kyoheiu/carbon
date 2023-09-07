import * as fs from 'node:fs/promises';
import { DEFAULT_LIST_NUMBER, toItem } from '$lib/toItem';
import { DATA_PATH } from '$lib/env';

export const load = async () => {
	const files = await fs.readdir(DATA_PATH, {
		withFileTypes: true
	});
	const names = files.filter((x) => x.isFile()).map((x) => x.name);
	const hasMany = names.length > DEFAULT_LIST_NUMBER;
	const result = toItem(names, false);
	result.sort((a, b) => b.modified - a.modified);
	return { result: result, hasMany: hasMany };
};
