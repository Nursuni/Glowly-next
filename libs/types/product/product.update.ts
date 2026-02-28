import { ProductType } from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;

	productTitle?: string;
	productPrice?: number;

	productImages?: string[];
	productDesc?: string;

	soldAt?: Date;
	deletedAt?: Date;
}
