export type Item = {
    title: string,
    content: string,
    modified: number
    hidden: boolean
}

export type ReadResponse = {
    result: Item[],
    more: boolean
}