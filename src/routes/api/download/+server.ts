import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { DATA_PATH } from '$lib/env';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const file: string | null = url.searchParams.get('file');
	if (!file) {
		return new Response('File not found.', {
			status: 400
		});
	}
	try {
		const content = (await fs.readFile(`${DATA_PATH}/${file}`)).toString();
		return new Response(content, {
			headers: {
				'Content-type': 'text/plain; charset=utf-8',
				'Content-Disposition': `attachment; filename="${encodeURI(file)}"`
			}
		});
	} catch (e) {
		logger.error(e);
		const message = `Failed to download file: ${file}`;
		return new Response(message, { status: 500 });
	}
};
