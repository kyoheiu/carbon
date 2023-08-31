import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import pino from 'pino';
import { DATA_PATH } from '$lib/env';

const logger = pino();

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const fn: string | null = url.searchParams.get('fn');
	if (!fn) {
		return new Response('File not found.', {
			status: 400
		});
	}
	try {
		const content = (await fs.readFile(`${DATA_PATH}/${fn}`)).toString();
		return new Response(content, {
			headers: {
				'Content-type': 'text/plain; charset=utf-8',
				'Content-Disposition': `attachment; filename="${encodeURI(fn)}"`
			}
		});
	} catch (e) {
		logger.error(e);
		const message = `Cannot download file: ${fn}`;
		return new Response(message, { status: 500 });
	}
};
