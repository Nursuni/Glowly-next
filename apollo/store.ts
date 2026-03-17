import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
import { CartItem } from '@/libs/components/basket/BasketModal';

export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberProducts: 0,
	memberGender: '',
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});

//@ts-ignore
export const socketVar = makeVar<WebSocket>();

// Global cart state — persists across page navigations
export const cartVar = makeVar<CartItem[]>([]);

export interface OrderSnapshot {
	orderId: string;
	items: CartItem[];
	subtotal: number;
	shipping: number;
	total: number;
}

// Global cart — persists across pages

// Snapshot of the last placed order — read by OrderSuccessPage
export const orderVar = makeVar<OrderSnapshot | null>(null);
