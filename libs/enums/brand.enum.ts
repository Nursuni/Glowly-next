// ✅ Add brand Application Status
export enum BrandApplicationStatus {
	PENDING = 'PENDING', // Submitted, waiting for review
	APPROVED = 'APPROVED', // Approved by admin
	REJECTED = 'REJECTED', // Rejected by admin
	REVISION_NEEDED = 'REVISION_NEEDED', // Needs more info
}

export enum MembershipTier {
	BRONZE = 'BRONZE',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
	PLATINUM = 'PLATINUM',
	DIAMOND = 'DIAMOND',
}
