import * as fs from 'node:fs';
import moment from 'moment';
import type { Item } from '$lib/types';
import { DATA_PATH } from './env';

export const DEFAULT_LIST_NUMBER = 12;

interface Stat {
	path: string;
	name: string;
	modified: number;
}

export const toItem = (arr: (string | null)[], showAll: boolean): Item[] => {
	const statResult: Stat[] = [];
	for (let i = 0; i < arr.length; i++) {
		const name = arr[i];
		if (name) {
			const path = `${DATA_PATH}/${name}`;
			const modified = moment(fs.statSync(path).mtimeMs).unix();
			statResult.push({ path: path, name: name, modified: modified });
		}
	}
	statResult.sort((a, b) => b.modified - a.modified);

	if (!showAll) {
		return statResult.slice(0, DEFAULT_LIST_NUMBER).map((x) => {
			return {
				name: x.name,
				desc: fs.readFileSync(x.path).toString().slice(0, 100),
				modified: x.modified,
				showModal: false
			};
		});
	} else {
		return statResult.map((x) => {
			return {
				name: x.name,
				desc: fs.readFileSync(x.path).toString().slice(0, 100),
				modified: x.modified,
				showModal: false
			};
		});
	}
};
