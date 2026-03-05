import { toast, Id, ToastOptions } from 'react-toastify';

/** Default global options */
const defaultOptions: ToastOptions = {
	position: 'top-right',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	theme: 'colored',
};

/** SUCCESS */
export const toastSuccess = (msg: string, options?: ToastOptions) =>
	toast.success(msg, { ...defaultOptions, ...options });

/** ERROR */
export const toastError = (msg: string, options?: ToastOptions) => toast.error(msg, { ...defaultOptions, ...options });

/** INFO */
export const toastInfo = (msg: string, options?: ToastOptions) => toast.info(msg, { ...defaultOptions, ...options });

/** WARNING */
export const toastWarning = (msg: string, options?: ToastOptions) =>
	toast.warning(msg, { ...defaultOptions, ...options });

/** LOADING */
export const toastLoading = (msg: string, options?: ToastOptions): Id =>
	toast.loading(msg, { ...defaultOptions, autoClose: false, ...options });

/** DISMISS */
export const toastDismiss = (id?: Id) => toast.dismiss(id);

/** UPDATE (useful after loading) */
export const toastUpdate = (
	id: Id,
	msg: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'success',
	options?: ToastOptions,
) => {
	toast.update(id, {
		render: msg,
		type,
		isLoading: false,
		autoClose: 3000,
		...options,
	});
};

/** PROMISE */
export const toastPromise = <T>(
	promise: Promise<T>,
	messages: {
		pending: string;
		success: string;
		error: string;
	},
	options?: ToastOptions,
) => {
	return toast.promise(
		promise,
		{
			pending: messages.pending,
			success: messages.success,
			error: messages.error,
		},
		{ ...defaultOptions, ...options },
	);
};
