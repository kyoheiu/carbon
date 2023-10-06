import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { DATA_PATH } from '$lib/env';
import { logger } from '$lib/logger';
import { saveFailed, postToGitServer, commitFailed, type Req } from '$lib/gitserver';

export const POST: RequestHandler = async (event) => {
	const req: Req = await event.request.json();

	if (req.original === req.new) {
		//Simply write new content to the file
		try {
			await fs.writeFile(`${DATA_PATH}/${req.new}`, req.content);
		} catch (e) {
			logger.error(e);
			return new Response(saveFailed, {
				status: 500
			});
		}
		const message = `Update ${req.new}`;
		try {
			await postToGitServer(req);
		} catch (e) {
			logger.error(e);
			return new Response(commitFailed, {
				status: 500
			});
		}
		logger.info(message);
		return new Response(null, {
			status: 200
		});
	} else {
		//Update file that already exists.
		try {
			await fs.rename(`${DATA_PATH}/${req.original}`, `${DATA_PATH}/${req.new}`);
			await fs.writeFile(`${DATA_PATH}/${req.new}`, req.content);
		} catch (e) {
			logger.error(e);
			return new Response(saveFailed, { status: 500 });
		}
		const message = `Rename ${req.original} to ${req.new}`;
		try {
			await postToGitServer(req);
		} catch (e) {
			logger.error(e);
			return new Response(commitFailed, {
				status: 500
			});
		}
		logger.info(message);
		return new Response(null, {
			status: 200
		});
	}
};
