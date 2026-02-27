export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
	HIDDEN = 'HIDDEN', // Hidden by admin
	REPORTED = 'REPORTED', // Flagged for review
}

export enum CommentGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
}
