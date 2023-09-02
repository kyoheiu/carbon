export interface Item {
	name: string;
	desc: string;
	modified: number;
	showModal: boolean;
}

export interface ItemContent {
	fileName: string;
	content: string;
	editing: boolean;
	err: boolean;
}
