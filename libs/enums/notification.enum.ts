export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	REPLY = 'REPLY',
	FOLLOW = 'FOLLOW',
	MENTION = 'MENTION',
}

export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	ORDER = 'ORDER',
	COMMENT = 'COMMENT',
	SYSTEM = 'SYSTEM',
}

export enum NotificationPriority {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
	URGENT = 'URGENT',
}
