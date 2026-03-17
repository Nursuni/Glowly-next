import {
	AgeRange,
	IngredientType,
	ProductStatus,
	ProductTarget,
	ProductType,
	SkinType,
	VolumeUnit,
} from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;

	productType: ProductType;
	productStatus: ProductStatus;
	productTitle: string;
	productPrice: number;

	volume?: number;
	volumeUnit?: VolumeUnit;
	skinType?: SkinType[];
	productTarget?: ProductTarget;
	ingredientType?: IngredientType[];
	ageRange?: AgeRange[];

	productViews: number;
	productLikes: number;
	productComments: number;
	productImages: string[];
	productDesc?: string;

	memberId: string;
	soldAt?: Date;
	manufacturedAt?: Date; // ✅ added
	expiresAt?: Date; // ✅ added
	deletedAt?: Date;

	createdAt: Date;
	updatedAt: Date;

	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
