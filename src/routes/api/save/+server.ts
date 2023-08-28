import * as fs from 'node:fs/promises';
import * as git from 'nodegit';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (event) => {
	const req = await event.request.json();
	console.log(req);

	if (req.original === req.new) {
		//Simply write new content to the file
		await fs.writeFile(`./data/${req.new}`, req.content);
		await addAndCommit('Update');
		return new Response(null, {
			status: 200
		});
	} else {
		if (req.original.length === 0) {
			//Create new file.
			await fs.writeFile(`./data/${req.new}`, req.content);
			await addAndCommit('Create');
			return new Response(null, {
				status: 201
			});
		} else {
			await fs.rename(`./data/${req.original}`, `./data/${req.new}`);
			await fs.writeFile(`./data/${req.new}`, req.content);
			await addAndCommit('Rename');
			return new Response(null, {
				status: 200
			});
		}
	}
};

const addAndCommit = async (message: string) => {
	const repo = await git.Repository.open('./data');
	const index = await repo.refreshIndex(); // read latest
	await index.addAll('*');
	await index.write(); // flush changes to index
	const changes = await index.writeTree(); // get reference to a set of changes
	const head = await git.Reference.nameToId(repo, 'HEAD'); // get reference to the current state
	const parent = await repo.getCommit(head); // get the commit for current state
	const author = git.Signature.now('miles', 'git@example.com'); // build auth/committer
	// combine all info into commit and return hash
	const commitId = await repo.createCommit('HEAD', author, author, message, changes, [parent]);
	console.log('commitId', commitId);
};
