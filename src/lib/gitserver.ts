export const saveFailed = 'Failed to save the change.';
export const commitFailed = 'Change saved, but failed to commit to the Git repository.';
export const createFailed = 'Failed to create new file. Possibly a file with the same name exists.';

export interface Req {
	original: string;
	new: string;
	content: string;
}
export const postToGitServer = async (req: Req) => {
	if (process.env.CARBON_GIT_SERVER) {
		await fetch(`http://${process.env.CARBON_GIT_SERVER}:8080/git`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(req)
		});
	}
};
