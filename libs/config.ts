export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
	// General
	UNKNOWN_ERROR: 'Something went wrong!',
	NETWORK_ERROR: 'Network error. Please try again.',
	SERVER_ERROR: 'Server is not responding.',

	// Auth
	LOGIN_REQUIRED: 'Please login first!',
	LOGIN_FAILED: 'Invalid email or password.',
	SESSION_EXPIRED: 'Your session has expired. Please login again.',
	UNAUTHORIZED: 'You are not authorized to perform this action.',

	// Validation
	REQUIRED_FIELDS: 'Please fill all required fields.',
	EMPTY_MESSAGE: 'Message is empty!',
	INVALID_EMAIL: 'Please enter a valid email address.',
	INVALID_PASSWORD: 'Password format is incorrect.',

	// Upload
	INVALID_IMAGE_FORMAT: 'Only jpeg, jpg, png images are allowed!',
	FILE_TOO_LARGE: 'File size is too large.',

	// CRUD Actions
	CREATE_SUCCESS: 'Successfully created!',
	UPDATE_SUCCESS: 'Successfully updated!',
	DELETE_SUCCESS: 'Successfully deleted!',

	// Connection
	TIMEOUT: 'Request timeout. Try again.',
} as const;
