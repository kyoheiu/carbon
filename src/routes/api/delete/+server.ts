import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import pino from 'pino';
import { DATA_PATH } from '$lib/env';

const logger = pino();

interface Req {
	file: string;
}

const postToGitServer = async (req: Req) => {
	await fetch(`http://${process.env.CARBON_GIT_SERVER}:8080/git`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req)
	});
};

export const DELETE: RequestHandler = async (event) => {
	const req = await event.request.json();
	try {
		await fs.rm(`${DATA_PATH}/${req.file}`, {
			force: false
		});
	} catch (e) {
		logger.error(e);
		const message = 'Cannot delete the file.';
		return new Response(message, { status: 500 });
	}

	const message = `Delete ${req.file}`;
	logger.info(message);
	try {
		await postToGitServer(req);
	} catch (e) {
		logger.error(e);
		const message = 'File deleted, but failed to commit to the Git repository.';
		return new Response(message, {
			status: 500
		});
	}
	return new Response(null, {
		status: 200
	});
};
