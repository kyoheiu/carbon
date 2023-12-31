import moment from "moment"
import toast from "react-hot-toast";

export const fromNow = (timeStamp: number): string => {
    return moment(timeStamp * 1000).fromNow(true);
}

export const toastError = (msg: string) => toast.error(msg, {
    position: 'bottom-center'
});