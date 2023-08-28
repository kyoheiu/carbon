import * as fs from 'node:fs/promises';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (event) => {
	const req = await event.request.json();
	const q: string = req.q;
	if (q.trim() === '') {
		return new Response(null, {
			status: 400
		});
	} else {
		const split = q.split(/\s+/).filter((x) => x.trim().length > 0)[0];
		if (split) {
			return new Response(null, {
				status: 303,
				headers: {
					location: `/search?q=${split}`
				}
			});
		} else {
			return new Response(null, {
				status: 400
			})
		}
	}
};
