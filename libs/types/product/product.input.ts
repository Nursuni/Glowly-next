import { AgeRange, ProductStatus, ProductTarget, ProductType, SkinType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	ageRange: any[];
	ingredientType: any[];
	skinType: any[];
	productTarget: string;
	volume: string | number | readonly string[];
	volumeUnit: string;

	productType: ProductType;
	productTitle: string;
	productPrice: number;
	productImages: string[];
	productDesc?: string;
	manufacturedAt?: Date;
	expiresAt?: Date;
	memberId?: string;
}

interface PISearch {
	productTypeList?: any[];
	memberId?: string;
	skinType?: SkinType[];
	productTarget?: ProductTarget;
	ageRange?: AgeRange[];
	pricesRange?: Range;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
	productTypeList?: ProductType[];
}

export interface BrandProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productType?: ProductType;
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}
