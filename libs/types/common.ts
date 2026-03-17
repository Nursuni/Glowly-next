import { Direction } from '../enums/common.enum';

export interface T {
	[key: string]: any;
}

const SORT_OPTIONS = [
	{ id: 'new', label: 'New', sort: 'createdAt', direction: Direction.DESC },
	{ id: 'old', label: 'Oldest', sort: 'createdAt', direction: Direction.ASC },
	{ id: 'likes', label: 'Likes', sort: 'productLikes', direction: Direction.DESC },
	{ id: 'views', label: 'Views', sort: 'productViews', direction: Direction.DESC },
];
