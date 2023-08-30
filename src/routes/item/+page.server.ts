import { DATA_PATH } from '$lib/env';
import { decode } from 'js-base64';
import * as fs from 'node:fs/promises';

export const load = async ({ url }: { url: URL }) => {
	const fn: string | null = url.searchParams.get('fn');
	if (!fn) {
		return {
			fileName: '',
			content: '',
			editing: true
		};
	} else {
		try {
			const original = decode(fn);
			const content = await fs.readFile(`${DATA_PATH}/${original}`);
			return { fileName: original, content: content.toString(), editing: false };
		} catch (e) {
			console.log(e);
			return { err: true };
		}
	}
};
