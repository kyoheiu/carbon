import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import pino from 'pino';
import { DATA_PATH } from '$lib/env';

const logger = pino();

interface Req {
	original: string;
	new: string;
	content: string;
}

const saveFailed = 'Failed to save the change.';
const commitFailed = 'Change saved, but failed to commit to the Git repository.';
const createFailed = 'Failed to create new file.';

const postToGitServer = async (req: Req) => {
	await fetch(`http://${process.env.CARBON_GIT_SERVER}:8080/git`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req)
	});
};

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
		if (req.original.length === 0) {
			//Create new file.
			try {
				await fs.writeFile(`${DATA_PATH}/${req.new}`, req.content);
			} catch (e) {
				logger.error(e);
				return new Response(createFailed, {
					status: 500
				});
			}
			const message = `Create ${req.new}`;
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
				status: 201
			});
		} else {
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
	}
};
