import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { DATA_PATH } from '$lib/env';
import { toItem } from '$lib/toItem';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async () => {
	try {
		const files = await fs.readdir(DATA_PATH, {
			withFileTypes: true
		});
		const names = files.filter((x) => x.isFile()).map((x) => x.name);
		const result = toItem(names, true);
		result.sort((a, b) => b.modified - a.modified);
		return new Response(JSON.stringify({ result: result }));
	} catch (e) {
		logger.error(e);
		const message = 'Failed to read all files.';
		return new Response(message, { status: 500 });
	}
};
