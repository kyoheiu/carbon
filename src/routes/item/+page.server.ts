import { DATA_PATH } from '$lib/env';
import { logger } from '$lib/logger';
import { decode } from 'js-base64';
import * as fs from 'node:fs/promises';

export const load = async ({ url }: { url: URL }) => {
	const file = url.searchParams.get('file') as string;
	const editing = url.searchParams.get('editing');
	try {
		const original = decode(file);
		const content = await fs.readFile(`${DATA_PATH}/${original}`);
		return { fileName: original, content: content.toString(), editing: editing ? true : false };
	} catch (e) {
		logger.error(e);
		return { err: true };
	}
};
