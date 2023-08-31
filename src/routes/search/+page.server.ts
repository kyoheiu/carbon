import * as child from 'node:child_process';
import { toItem } from '$lib/toItem';
import { DATA_PATH } from '$lib/env';

const fd = process.env.NODE_ENV === 'production' ? 'fdfind' : 'fd';

export const load = async ({ url }: { url: URL }) => {
	const q: string | null = url.searchParams.get('q');
	if (!q) {
		return {
			result: []
		};
	}
	const fileNameResult = new Set<string>();

	//fdfind
	const subprocessFd = child.spawnSync(fd, [q, DATA_PATH]);
	const splitFd: (string | null)[] = subprocessFd.stdout
		.toString()
		.split('\n')
		.filter((x: string) => x.length > 0)
		.map((x: string) => {
			return x.split('/').at(-1) ?? null;
		})
		.filter((x) => x !== null);
	splitFd.forEach((s) => {
		if (s) {
			fileNameResult.add(s);
		}
	});

	//ripgrep
	const subprocessRg = child.spawnSync('rg', ['-l', q, DATA_PATH]);
	const splitRg: (string | null)[] = subprocessRg.stdout
		.toString()
		.split('\n')
		.filter((x: string) => x.length > 0)
		.map((x: string) => {
			return x.split('/').at(-1) ?? null;
		})
		.filter((x) => x !== null);
	splitRg.forEach((s) => {
		if (s) {
			fileNameResult.add(s);
		}
	});

	const items = toItem(Array.from(fileNameResult.values()));

	return {
		result: items,
		query: q
	};
};
