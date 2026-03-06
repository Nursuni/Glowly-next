export enum MemberType {
	USER = 'USER',
	ADMIN = 'ADMIN',
	BRAND = 'BRAND',
	CONSULTATORS = 'CONSULTATORS',
}

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
	GOOGLE = 'GOOGLE',
	KAKAO = 'KAKAO',
	NAVER = 'NAVER',
	APPLE = 'APPLE',
}

export enum MemberGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	NON_BINARY = 'NON_BINARY',
	PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}
