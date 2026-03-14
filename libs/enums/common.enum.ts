export enum Message {
	// General Errors
	SOMETHING_WENT_WRONG = 'Something went wrong!',
	NO_DATA_FOUND = 'No data found!',
	CREATE_FAILED = 'Create failed!',
	UPDATE_FAILED = 'Update failed!',
	REMOVE_FAILED = 'Remove failed!',
	UPLOAD_FAILED = 'Upload failed!',
	BAD_REQUEST = 'Bad Request',

	// Authentication & Authorization
	USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone',
	NO_MEMBER_NICK = 'No member with that member nick!',
	BLOCKED_USER = 'You have been blocked!',
	WRONG_PASSWORD = 'Wrong password, try again!',
	NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
	TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles!',
	NOT_ALLOWED_REQUEST = 'Not Allowed Request!',

	// Validation & Format
	PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg or png images!',
	INVALID_INPUT = 'Invalid input provided!',
	REQUIRED_FIELD_MISSING = 'Required field is missing!',

	// Business Logic
	SELF_SUBSCRIPTION_DENIED = 'Self subscription is denied!',
	INSUFFICIENT_STOCK = 'Insufficient stock available!',
	PRODUCT_NOT_AVAILABLE = 'Product is not available!',
	ALREADY_PURCHASED = 'You have already purchased this product!',
	ALREADY_REPORTED = 'ALREADY_REPORTED',
	INSERT_ALL_INPUTS = 'INSERT_ALL_INPUTS',
}

export enum Direction {
	ASC = 1,
	DESC = -1,
}
