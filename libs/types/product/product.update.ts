import {
	AgeRange,
	IngredientType,
	ProductStatus,
	ProductTarget,
	ProductType,
	SkinType,
	VolumeUnit,
} from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;
	productStatus?: ProductStatus;

	productTitle?: string;
	productPrice?: number;

	volume?: number;
	volumeUnit?: VolumeUnit;
	skinType?: SkinType[];
	productTarget?: ProductTarget;
	ingredientType?: IngredientType[];
	ageRange?: AgeRange[];

	productImages?: string[];
	productDesc?: string;

	soldAt?: Date;
	manufacturedAt?: Date;
	expiresAt?: Date;
	deletedAt?: Date;
}
