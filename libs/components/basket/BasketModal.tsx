import React, { useMemo } from 'react';
import { Drawer, IconButton, Typography, Button, Box } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useRouter } from 'next/router';

export interface CartItem {
	_id: string;
	productName: string;
	productBrand: string;
	productImage: string;
	unitPrice: number;
	quantity: number;
	inStock: boolean;
}

interface PromoGift {
	id: string;
	title: string;
	description: string;
	image?: string;
	condition: (items: CartItem[]) => boolean; // when to show
}

export interface BasketModalProps {
	open: boolean;
	onClose: () => void;
	items?: CartItem[]; // optional, default to empty
	onQtyChange?: (id: string, delta: number) => void; // optional
	onRemove?: (id: string) => void; // optional
}

const BasketModal: React.FC<BasketModalProps> = ({
	open,
	onClose,
	items = [], // default empty array
	onQtyChange = () => {}, // default no-op
	onRemove = () => {}, // default no-op
}) => {
	const router = useRouter();

	// Safe subtotal calculation
	const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

	const goToCheckout = () => {
		onClose();
		router.push('/checkout');
	};

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box sx={{ width: 380, height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
				{/* Header */}
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
					<ShoppingBagOutlinedIcon />
					<Typography ml={1} fontWeight={600}>
						Your Basket
					</Typography>
				</Box>

				{/* Items */}
				<Box sx={{ flex: 1, overflowY: 'auto' }}>
					{items.length === 0 && <Typography color="text.secondary">Your basket is empty.</Typography>}

					{items.map((item) => (
						<Box key={item._id} sx={{ display: 'flex', mb: 2, gap: 2 }}>
							<img
								src={item.productImage}
								alt={item.productName}
								style={{ width: 60, height: 60, objectFit: 'cover' }}
							/>
							<Box sx={{ flex: 1 }}>
								<Typography fontSize={14}>{item.productBrand}</Typography>
								<Typography fontWeight={500}>{item.productName}</Typography>
								<Typography fontSize={13}>${item.unitPrice}</Typography>

								<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
									<IconButton size="small" onClick={() => onQtyChange(item._id, -1)}>
										<RemoveRoundedIcon fontSize="small" />
									</IconButton>
									<Typography mx={1}>{item.quantity}</Typography>
									<IconButton size="small" onClick={() => onQtyChange(item._id, 1)}>
										<AddRoundedIcon fontSize="small" />
									</IconButton>
								</Box>
							</Box>
							<IconButton onClick={() => onRemove(item._id)}>
								<DeleteOutlineRoundedIcon />
							</IconButton>
						</Box>
					))}
				</Box>

				{/* Summary */}
				<Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
						<Typography>Subtotal</Typography>
						<Typography>${subtotal.toFixed(2)}</Typography>
					</Box>

					<Button fullWidth variant="contained" onClick={goToCheckout} endIcon={<ArrowForwardRoundedIcon />}>
						Checkout
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default BasketModal;
