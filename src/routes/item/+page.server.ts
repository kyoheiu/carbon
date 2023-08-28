import { decode } from 'js-base64';
import * as fs from 'node:fs/promises';

export const load = async ({ url }: {url: URL}) => {
	const fn: string | null = url.searchParams.get('fn');
	if (!fn) {
		return {
			fileName: '',
			content: '',
			editing: true
		};
	} else {
		const original = decode(fn);
		const content = (await fs.readFile(`./data/${original}`)).toString();
		return { fileName: original, content: content, editing: false };
	}
};
