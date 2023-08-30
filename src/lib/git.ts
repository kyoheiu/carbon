import * as git from 'nodegit';
import { DATA_PATH } from './env';

export const addAndCommit = async (message: string) => {
	const repo = await git.Repository.open(DATA_PATH);
	const index = await repo.refreshIndex(); // read latest
	await index.addAll('*');
	await index.write(); // flush changes to index
	const changes = await index.writeTree(); // get reference to a set of changes
	const head = await git.Reference.nameToId(repo, 'HEAD'); // get reference to the current state
	const parent = await repo.getCommit(head); // get the commit for current state
	const author = git.Signature.now('carbon', 'git@example.com'); // build auth/committer
	// combine all info into commit and return hash
	await repo.createCommit('HEAD', author, author, message, changes, [parent]);
};
