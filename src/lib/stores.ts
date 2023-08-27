import { get, writable, type Writable } from "svelte/store";

export const DEFAULT_LIST_NUMBER = 10;

export class State {
  page: Page;
  items: Item[];
  query: string;
  queryFixed: string;
  showAll: boolean;
  fileName: string;
  newName: string;
  content: string;

  constructor() {
    this.page = Page.Top;
    this.items = [];
    this.query = "";
    this.queryFixed = "";
    this.showAll = false;
    this.fileName = "";
    this.newName = "";
    this.content = "";
  }
}

export enum Page {
  Top,
  View,
  Edit,
}

export interface Item {
  name: string;
  desc: string;
  modified: number;
  showModal: boolean;
}

export interface Res {
  name: string;
  desc: string;
  modified: number;
}

export const state: Writable<State> = writable(new State());

export const resetItem = async () => {
  const res = await fetch("/item");
  const j: Res[] = await res.json();
  const items: Item[] = j.map((x) => {
    return { ...x, showModal: false };
  });
  state.update((s) => {
    return {
      ...s,
      items: items,
    };
  });
};

export const addItem = () => {
  state.update((s) => {
    return {
      ...new State(),
      page: Page.Edit,
    };
  });
};

export const seeMoreItem = () => {
  state.update((s) => {
    return {
      ...s,
      showAll: true,
    };
  });
};

export const readItem = async (name: string) => {
  const res = await fetch(`/item?item=${name}`);
  const body = await res.text();
  state.update((s) => {
    return {
      ...new State(),
      page: Page.View,
      fileName: name,
      newName: name,
      content: body,
    };
  });
  window.scrollTo(0, 0);
};

export const editItemDirectly = async (name: string) => {
  const res = await fetch(`/item?item=${name}`);
  const body = await res.text();
  state.update((s) => {
    return {
      ...new State(),
      page: Page.Edit,
      fileName: name,
      newName: name,
      content: body,
    };
  });
  window.scrollTo(0, 0);
};

export const reviewItem = () => {
  state.update((s) => {
    return {
      ...s,
      page: Page.View,
    };
  });
};

export const searchItem = async () => {
  const query = get(state).query;
  const res = await fetch("/item/search", {
    method: "POST",
    body: query,
  });
  if (res.ok) {
    const j: Res[] = await res.json();
    console.log(j);
    const items = j.map((x) => {
      return {
        ...x,
        showModal: false,
      };
    });
    state.update((s) => {
      return {
        ...new State(),
        page: Page.Top,
        items: items,
        filter: null,
        queryFixed: query,
      };
    });
    window.scrollTo(0, 0);
  }
};

export const editItem = () => {
  state.update((s) => {
    return {
      ...s,
      page: Page.Edit,
    };
  });
};

export const toTop = (s: Writable<State>) => {
  state.update(() => {
    return new State();
  });
};
