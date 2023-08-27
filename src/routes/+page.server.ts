import type { Item } from '$lib/stores';
import { json } from '@sveltejs/kit';
import moment from 'moment';
import * as fs from 'node:fs/promises';

export const load = async () => {
    let result: Item[] = [];

    const files = await fs.readdir("./data");
    for (var i = 0; i < files.length; i ++) {

        let name = files[i];
        const fd = await fs.open(`./data/${files[i]}`);
        let desc = (await fd.readFile()).toString().slice(0,100);
        let modified = moment((await fd.stat()).mtimeMs).unix();
        result.push({name: name, desc: desc, modified: modified, showModal: false});
        await fd.close();
    }
    console.log(result);
    return {result: result};
}