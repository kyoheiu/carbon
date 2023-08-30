import type { Item } from '$lib/types';
import * as child from 'node:child_process';
import { toItem } from '$lib/toItem';
import { DATA_PATH } from '$lib/env';

export const prerender = false;
export const csr = false;

export const load = async ({ url }: { url: URL }) => {
	const q: string | null = url.searchParams.get('q');
	if (!q) {
		return {
			result: []
		};
	}
	const result: Item[] = [];

	const subprocess = child.spawnSync('rg', ['-l', q, DATA_PATH]);
	const split: (string | null)[] = subprocess.stdout
		.toString()
		.split('\n')
		.filter((x: string) => x.length > 0)
		.map((x: string) => {
			return x.split('/').at(-1) ?? null;
		});
	const items = toItem(split);
	items.forEach((item) => {
		result.push(item);
	});
	return {
		result: result,
		query: q
	};
};
