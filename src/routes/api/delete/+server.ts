import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async (event) => {
	const req = await event.request.json();
	await fs.rm(`./data/${req.fn}`, {
		force: false
	});

	return new Response('Deleted.', {
		status: 200
	});
};
