import * as git from 'nodegit';
import { DATA_PATH } from './env';

export const addAndCommit = async (file: string, message: string) => {
	const repo = await git.Repository.open(DATA_PATH);
	const index = await repo.refreshIndex();
		const result = await index.addByPath(file);
		if (result === 0) {
			throw Error(`Cannot add to index: ${file}`);
		}
	await index.write();

	const changes = await index.writeTree();
	const head = await git.Reference.nameToId(repo, 'HEAD');
	const parent = await repo.getCommit(head);
	const author = git.Signature.now('carbon', 'git@example.com');
	await repo.createCommit('HEAD', author, author, message, changes, [parent]);
};

export const removeAndCommit = async(file: string) => {
	const repo = await git.Repository.open(DATA_PATH);
	const index = await repo.refreshIndex();
		const result = await index.removeByPath(file);
		if (result === 0) {
			throw Error(`Cannot delete from index: ${file}`);
		}
	await index.write();

	const changes = await index.writeTree();
	const head = await git.Reference.nameToId(repo, 'HEAD');
	const parent = await repo.getCommit(head);
	const author = git.Signature.now('carbon', 'git@example.com');
	await repo.createCommit('HEAD', author, author, `Remove ${file}`, changes, [parent]);
}