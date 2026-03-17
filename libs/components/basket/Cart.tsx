// ── libs/utils/cart.ts ─────────────────────────────────────
// Use this helper anywhere you have an "Add to Cart" button

import { NEXT_PUBLIC_API_URL } from '@/libs/config';
import { CartItem } from './BasketModal';
import { cartVar } from '@/apollo/store';

export const addToCart = (product: {
	_id: string;
	productName: string;
	productBrand?: string;
	productImages?: string[];
	productPrice: number;
	productStatus?: string;
}) => {
	const current = cartVar();
	const existing = current.find((i) => i._id === product._id);

	if (existing) {
		// Already in cart — increment quantity
		cartVar(current.map((i) => (i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)));
	} else {
		// New item
		const newItem: CartItem = {
			_id: product._id,
			productName: product.productName,
			productBrand: product.productBrand ?? '',
			productImage: product.productImages?.[0]
				? `${NEXT_PUBLIC_API_URL}/${product.productImages[0]}`
				: '/img/product/default.svg',
			unitPrice: product.productPrice,
			quantity: 1,
			inStock: product.productStatus === 'ACTIVE',
		};
		cartVar([...current, newItem]);
	}
};

// ── Usage in any component ─────────────────────────────────
// import { addToCart } from '@/libs/utils/cart';
//
// <button onClick={() => addToCart(product)}>Add to Cart</button>
