import type { Item } from '$lib/types';
import * as child from 'node:child_process';
import { toItem } from '$lib/toItem';

export const prerender = false;
export const csr = false;

export const load = async ({ url }: {url: URL}) => {
	const q: string | null = url.searchParams.get('q');
	if (!q) {
		return {
			result: []
		};
	}
	let result: Item[] = [];

	const subprocess = child.spawnSync('rg', ['-l', q, './data']);
	const split: string[] = subprocess.stdout
		.toString()
		.split('\n')
		.filter((x: string) => x.length > 0)
		.map((x: string) => {
			return x.split('/').at(-1)!;
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
