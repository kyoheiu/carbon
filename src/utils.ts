import moment from "moment"

export const fromNow = (timeStamp: number): string => {
    return moment(timeStamp * 1000).fromNow(true);
}