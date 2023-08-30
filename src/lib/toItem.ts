import * as fs from 'node:fs';
import moment from 'moment';
import { encode } from 'js-base64';
import type { Item } from '$lib/types';
import { DATA_PATH } from './env';

export const toItem = (arr: (string | null)[]): Item[] => {
	const result: Item[] = [];
	for (let i = 0; i < arr.length; i++) {
		const path = `${DATA_PATH}/${arr[i]}`;
		const name = arr[i];
		if (name) {
			const base64 = encode(name);
			const desc = fs.readFileSync(path).toString().slice(0, 100);
			const modified = moment(fs.statSync(path).mtimeMs).unix();
			result.push({ name: name, base64: base64, desc: desc, modified: modified, showModal: false });
		}
	}
	result.sort((a, b) => b.modified - a.modified);
	return result;
};
