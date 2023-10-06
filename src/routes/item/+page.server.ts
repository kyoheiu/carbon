import { DATA_PATH } from '$lib/env';
import { logger } from '$lib/logger';
import { decode } from 'js-base64';
import * as fs from 'node:fs/promises';

export const load = async ({ url }: { url: URL }) => {
	const file: string | null = url.searchParams.get('file');
	if (!file) {
		return {
			fileName: '',
			content: '',
			editing: true
		};
	} else {
		try {
			const original = decode(file);
			const content = await fs.readFile(`${DATA_PATH}/${original}`);
			return { fileName: original, content: content.toString(), editing: false };
		} catch (e) {
			logger.error(e);
			return { err: true };
		}
	}
};
