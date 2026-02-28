import { Direction } from '../../enums/common.enum';
import { ProductStatus, ProductType } from '../../enums/product.enum';

export interface ProductInput {
	productType: ProductType;

	productTitle: string;
	productPrice: number;

	productyImages: string[];
	productDesc?: string;

	memberId?: string;
}

interface PISearch {
	memberId?: string;

	typeList?: ProductType[];

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

export interface SellerProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
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
