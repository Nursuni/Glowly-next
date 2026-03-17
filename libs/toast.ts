import { toast, Id, ToastOptions } from 'react-toastify';
import { ApolloError } from '@apollo/client';

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

/** Helper: get string message from any error type */
const getErrorMessage = (err: unknown): string => {
	if (!err) return 'Unknown error';
	if (typeof err === 'string') return err;
	if (err instanceof Error) return err.message;
	if (err instanceof ApolloError) {
		// GraphQL errors take priority
		if (err.graphQLErrors?.length > 0) return err.graphQLErrors[0].message;
		if (err.networkError) return (err.networkError as any).message || 'Network error';
		return err.message || 'Apollo error occurred';
	}
	// Fallback: stringify unknown objects
	try {
		return JSON.stringify(err);
	} catch {
		return String(err);
	}
};

/** SUCCESS */
export const toastSuccess = (msg: string | Error | unknown, options?: ToastOptions) =>
	toast.success(getErrorMessage(msg), { ...defaultOptions, ...options });

/** ERROR */
export const toastError = (msg: string | Error | unknown, options?: ToastOptions) =>
	toast.error(getErrorMessage(msg), { ...defaultOptions, ...options });

/** INFO */
export const toastInfo = (msg: string | Error | unknown, options?: ToastOptions) =>
	toast.info(getErrorMessage(msg), { ...defaultOptions, ...options });

/** WARNING */
export const toastWarning = (msg: string | Error | unknown, options?: ToastOptions) =>
	toast.warning(getErrorMessage(msg), { ...defaultOptions, ...options });

/** LOADING */
export const toastLoading = (msg: string | Error | unknown, options?: ToastOptions): Id =>
	toast.loading(getErrorMessage(msg), { ...defaultOptions, autoClose: false, ...options });

/** DISMISS */
export const toastDismiss = (id?: Id) => toast.dismiss(id);

/** UPDATE (useful after loading) */
export const toastUpdate = (
	id: Id,
	msg: string | Error | unknown,
	type: 'success' | 'error' | 'info' | 'warning' = 'success',
	options?: ToastOptions,
) => {
	toast.update(id, {
		render: getErrorMessage(msg),
		type,
		isLoading: false,
		autoClose: 3000,
		...options,
	});
};

/** PROMISE */
export const toastPromiseSafe = async <T>(
	promise: Promise<T>,
	messages: { pending: string; success: string; error?: string },
	options?: ToastOptions,
) => {
	const id = toastLoading(messages.pending, options);
	try {
		const result = await promise;
		toastUpdate(id, messages.success, 'success', options);
		return result;
	} catch (err) {
		toastUpdate(id, getErrorMessage(err), 'error', options);
		throw err;
	}
};
