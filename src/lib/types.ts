export const DEFAULT_LIST_NUMBER = 10;

export interface Item {
	name: string;
	base64: string;
	desc: string;
	modified: number;
	showModal: boolean;
}

export interface ItemContent {
	fileName: string;
	content: string;
	editing: boolean;
}
