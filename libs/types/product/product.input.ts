import { Direction } from '../../enums/common.enum';
import { ProductStatus, ProductType, SkinType } from '../../enums/product.enum';

export interface ProductInput {
	productType: ProductType;

	productTitle: string;
	productPrice: number;

	productImages: string[];
	productDesc?: string;

	memberId?: string;
}

interface PISearch {
	typeList: any[];
	productTypeList: any[];
	memberId?: string;

	skinType?: SkinType[];
	options?: string[];

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
