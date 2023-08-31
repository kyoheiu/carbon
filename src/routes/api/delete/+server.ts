import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import pino from 'pino';
import { addAndCommit, removeAndCommit } from '$lib/git';
import { DATA_PATH } from '$lib/env';

const logger = pino();

export const DELETE: RequestHandler = async (event) => {
	const req = await event.request.json();
	try {
		await fs.rm(`${DATA_PATH}/${req.fn}`, {
			force: false
		});
	} catch (e) {
		const message = 'Cannot delete the file.';
		logger.error(message);
		return new Response(message, { status: 500 });
	}

	const message = `Delete ${req.fn}`;
	logger.info(message);
	try {
		await removeAndCommit(req.fn);
	} catch (e) {
		const message = 'File deleted, but failed to commit to the Git repository.';
		logger.error(message);
		return new Response(message, {
			status: 500
		});
	}
	return new Response(null, {
		status: 200
	});
};
