export enum BoardArticleCategory {
	FREE = 'FREE',
	RECOMMEND = 'RECOMMEND',
	NEWS = 'NEWS',
	QUESTION = 'QUESTION', // Q&A posts
	REVIEW = 'REVIEW', // Product reviews
	TUTORIAL = 'TUTORIAL', // How-to guides
	DISCUSSION = 'DISCUSSION', // General discussions
	ANNOUNCEMENT = 'ANNOUNCEMENT', // Official announcements
}

export enum BoardArticleStatus {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
	HIDDEN = 'HIDDEN', // Hidden by admin
	REPORTED = 'REPORTED', // Flagged for review
}

export enum BoardArticlePriority {
	NORMAL = 'NORMAL',
	PINNED = 'PINNED',
	FEATURED = 'FEATURED',
}

export enum BoardArticleReportReason {
	SPAM = 'SPAM',
	INAPPROPRIATE = 'INAPPROPRIATE',
	MISINFORMATION = 'MISINFORMATION',
	HARASSMENT = 'HARASSMENT',
}
