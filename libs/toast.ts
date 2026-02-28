import { toast } from 'react-toastify';

export const toastSuccess = (msg: string) => toast.success(msg);

export const toastError = (msg: string) => toast.error(msg);

export const toastInfo = (msg: string) => toast.info(msg);

export const toastPromise = <T>(
	promise: Promise<T>,
	messages: {
		pending: string;
		success: string;
		error: string;
	},
) => {
	return toast.promise(promise, messages);
};
