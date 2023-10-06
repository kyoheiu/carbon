import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { DATA_PATH } from '$lib/env';
import { logger } from '$lib/logger';
import { postToGitServer, createFailed } from '$lib/gitserver';

export const POST: RequestHandler = async () => {
	try {
		const files = await fs.readdir(DATA_PATH, {
			withFileTypes: true
		});
		const names = files.filter((x) => x.isFile()).map((x) => x.name);
		let suffix = 1;
		for (;;) {
			if (!names.includes(`untitled_${suffix}`)) {
				break;
			} else {
				suffix += 1;
				continue;
			}
		}
		const fileName = `untitled_${suffix}`;
		const fh = await fs.open(`${DATA_PATH}/${fileName}`, 'a');
		await fh.close();

		const message = `Create ${fileName}`;
		try {
			await postToGitServer({ original: '', new: fileName, content: '' });
		} catch (e) {
			logger.error(e);
			return new Response(createFailed, {
				status: 500
			});
		}
		logger.info(message);

		return new Response(JSON.stringify({ name: fileName }));
	} catch (e) {
		logger.error(e);
		const message = 'Failed to suggest new file name.';
		return new Response(message, { status: 500 });
	}
};
