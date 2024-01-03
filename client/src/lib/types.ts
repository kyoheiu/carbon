export type ListItem = {
    title: string,
    modified: number,
    hidden: boolean
}

export type Item = {
    title: string,
    content: string,
    modified: number,
}

export type ReadResponse = {
    result: ListItem[],
    more: boolean
}