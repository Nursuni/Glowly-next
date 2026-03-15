import React, { useMemo } from 'react';
import { Drawer, IconButton, Typography, Button, Box, Divider } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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

export interface BasketModalProps {
	open: boolean;
	onClose: () => void;
	items?: CartItem[];
	onQtyChange?: (id: string, delta: number) => void;
	onRemove?: (id: string) => void;
}

// ── Design tokens ──────────────────────────────────────────
const T = {
	pink: '#f564a9',
	gold: '#c08a5e',
	dark: '#2a2520',
	warmOff: '#f5f0ea',
	muted: '#7a7067',
	border: '#f0ebe4',
	bg: '#faf9f7',
	serif: "'Cormorant Garamond', serif",
	sans: "'Jost', sans-serif",
};

const FREE_SHIPPING_THRESHOLD = 80;

const BasketModal: React.FC<BasketModalProps> = ({
	open,
	onClose,
	items = [],
	onQtyChange = () => {},
	onRemove = () => {},
}) => {
	const router = useRouter();

	const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

	const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
	const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
	const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;

	const goToCheckout = () => {
		onClose();
		router.push('/checkout');
	};

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: 400,
					background: T.bg,
					borderLeft: `1px solid ${T.border}`,
					boxShadow: '-8px 0 48px rgba(42,37,32,0.08)',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
				},
			}}
		>
			{/* ── Header ── */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					px: '28px',
					py: '22px',
					background: '#fff',
					borderBottom: `1px solid ${T.border}`,
					flexShrink: 0,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: T.muted }} />
					<Box>
						<Typography
							sx={{
								fontFamily: T.serif,
								fontSize: '22px',
								fontWeight: 300,
								color: T.dark,
								lineHeight: 1,
							}}
						>
							Your Basket
						</Typography>
						{items.length > 0 && (
							<Typography
								sx={{
									fontFamily: T.sans,
									fontSize: '11px',
									color: T.muted,
									letterSpacing: '0.08em',
									mt: '2px',
								}}
							>
								{items.length} {items.length === 1 ? 'item' : 'items'}
							</Typography>
						)}
					</Box>
				</Box>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{
						color: T.muted,
						'&:hover': { color: T.pink, background: `rgba(245,100,169,0.06)` },
					}}
				>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</Box>

			{/* ── Shipping nudge ── */}
			{items.length > 0 && (
				<Box
					sx={{
						mx: '20px',
						mt: '16px',
						px: '16px',
						py: '12px',
						border: `1px solid ${shippingFree ? 'rgba(192,138,94,0.3)' : T.border}`,
						borderRadius: '4px',
						background: shippingFree ? 'rgba(192,138,94,0.04)' : '#fff',
						flexShrink: 0,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<LocalShippingOutlinedIcon sx={{ fontSize: 16, color: T.gold, flexShrink: 0 }} />
						<Typography sx={{ fontFamily: T.sans, fontSize: '12px', color: T.muted }}>
							{shippingFree ? (
								<>
									<strong style={{ color: T.dark }}>Free shipping</strong> applied to your order ✓
								</>
							) : (
								<>
									Add <strong style={{ color: T.dark }}>${remaining.toFixed(2)}</strong> more for{' '}
									<strong style={{ color: T.dark }}>free shipping</strong>
								</>
							)}
						</Typography>
					</Box>
					<Box
						sx={{
							mt: '8px',
							height: '3px',
							background: T.border,
							borderRadius: '2px',
							overflow: 'hidden',
						}}
					>
						<Box
							sx={{
								height: '100%',
								width: `${shippingProgress}%`,
								background: `linear-gradient(90deg, ${T.gold}, ${T.pink})`,
								borderRadius: '2px',
								transition: 'width 0.4s ease',
							}}
						/>
					</Box>
				</Box>
			)}

			{/* ── Items ── */}
			<Box sx={{ flex: 1, overflowY: 'auto', px: '20px', py: '16px' }}>
				{/* Empty state */}
				{items.length === 0 && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
							gap: '14px',
							textAlign: 'center',
							pb: '40px',
						}}
					>
						<Box
							sx={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								border: `1px solid ${T.border}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								background: '#fff',
								mb: '4px',
							}}
						>
							<ShoppingBagOutlinedIcon sx={{ fontSize: 28, color: `rgba(122,112,103,0.35)` }} />
						</Box>
						<Typography
							sx={{
								fontFamily: T.serif,
								fontSize: '24px',
								fontWeight: 300,
								fontStyle: 'italic',
								color: T.dark,
							}}
						>
							Your basket is empty
						</Typography>
						<Typography
							sx={{
								fontFamily: T.sans,
								fontSize: '13px',
								color: T.muted,
								fontWeight: 300,
								maxWidth: '220px',
								lineHeight: 1.6,
							}}
						>
							Discover something beautiful to add to your collection.
						</Typography>
						<Button
							onClick={() => {
								onClose();
								router.push('/catalog');
							}}
							sx={{
								mt: '6px',
								height: 42,
								px: '24px',
								borderRadius: '2px',
								background: T.dark,
								color: '#fff',
								fontFamily: T.sans,
								fontSize: '11px',
								fontWeight: 500,
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
								'&:hover': { background: '#3d3730' },
							}}
						>
							Explore Products
						</Button>
					</Box>
				)}

				{/* Item cards */}
				{items.map((item, idx) => (
					<Box
						key={item._id}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
							px: '16px',
							py: '16px',
							background: '#fff',
							border: `1px solid ${T.border}`,
							borderTop: idx === 0 ? `1px solid ${T.border}` : 'none',
							borderRadius:
								items.length === 1 ? '6px' : idx === 0 ? '6px 6px 0 0' : idx === items.length - 1 ? '0 0 6px 6px' : '0',
							opacity: item.inStock ? 1 : 0.65,
							transition: 'background 0.15s',
							'&:hover': { background: T.bg },
						}}
					>
						{/* Image */}
						<Box
							sx={{
								position: 'relative',
								flexShrink: 0,
								width: 72,
								height: 72,
								borderRadius: '4px',
								overflow: 'hidden',
								border: `1px solid ${T.border}`,
								background: T.warmOff,
							}}
						>
							<img
								src={item.productImage}
								alt={item.productName}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
							{!item.inStock && (
								<Box
									sx={{
										position: 'absolute',
										inset: 0,
										background: 'rgba(42,37,32,0.55)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										sx={{
											fontFamily: T.sans,
											fontSize: '8px',
											fontWeight: 500,
											letterSpacing: '0.08em',
											textTransform: 'uppercase',
											color: '#fff',
										}}
									>
										Sold Out
									</Typography>
								</Box>
							)}
						</Box>

						{/* Info */}
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography
								sx={{
									fontFamily: T.sans,
									fontSize: '9px',
									letterSpacing: '0.22em',
									textTransform: 'uppercase',
									color: T.pink,
									fontWeight: 500,
								}}
							>
								{item.productBrand}
							</Typography>
							<Typography
								sx={{
									fontFamily: T.serif,
									fontSize: '17px',
									fontWeight: 400,
									color: T.dark,
									lineHeight: 1.2,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{item.productName}
							</Typography>
							<Typography
								sx={{
									fontFamily: T.sans,
									fontSize: '11px',
									color: T.muted,
									fontWeight: 300,
									mt: '2px',
								}}
							>
								${item.unitPrice.toFixed(2)} each
							</Typography>

							{/* Qty control */}
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									mt: '10px',
									border: `1px solid ${T.border}`,
									borderRadius: '3px',
									overflow: 'hidden',
								}}
							>
								<IconButton
									size="small"
									disabled={item.quantity <= 1}
									onClick={() => onQtyChange(item._id, -1)}
									sx={{
										width: 28,
										height: 28,
										borderRadius: 0,
										background: T.bg,
										'&:hover:not(:disabled)': { background: T.border },
										'&:disabled': { opacity: 0.4 },
									}}
								>
									<RemoveRoundedIcon sx={{ fontSize: 13, color: T.dark }} />
								</IconButton>
								<Typography
									sx={{
										width: 32,
										textAlign: 'center',
										fontFamily: T.sans,
										fontSize: '12px',
										fontWeight: 500,
										color: T.dark,
										borderLeft: `1px solid ${T.border}`,
										borderRight: `1px solid ${T.border}`,
										lineHeight: '28px',
									}}
								>
									{item.quantity}
								</Typography>
								<IconButton
									size="small"
									onClick={() => onQtyChange(item._id, 1)}
									sx={{
										width: 28,
										height: 28,
										borderRadius: 0,
										background: T.bg,
										'&:hover': { background: T.border },
									}}
								>
									<AddRoundedIcon sx={{ fontSize: 13, color: T.dark }} />
								</IconButton>
							</Box>
						</Box>

						{/* Right: price + delete */}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-end',
								gap: '8px',
								flexShrink: 0,
							}}
						>
							<Typography
								sx={{
									fontFamily: T.serif,
									fontSize: '18px',
									fontWeight: 400,
									color: T.dark,
								}}
							>
								${(item.unitPrice * item.quantity).toFixed(2)}
							</Typography>
							<IconButton
								size="small"
								onClick={() => onRemove(item._id)}
								sx={{
									color: T.muted,
									p: '4px',
									'&:hover': { color: T.pink, background: `rgba(245,100,169,0.06)` },
								}}
							>
								<DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
							</IconButton>
						</Box>
					</Box>
				))}
			</Box>

			{/* ── Summary footer ── */}
			{items.length > 0 && (
				<Box
					sx={{
						flexShrink: 0,
						px: '20px',
						pb: '24px',
						pt: '16px',
						background: '#fff',
						borderTop: `1px solid ${T.border}`,
					}}
				>
					{/* Rows */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '12px' }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography sx={{ fontFamily: T.sans, fontSize: '13px', color: T.muted, fontWeight: 300 }}>
								Subtotal
							</Typography>
							<Typography sx={{ fontFamily: T.sans, fontSize: '13px', color: T.muted, fontWeight: 300 }}>
								${subtotal.toFixed(2)}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography sx={{ fontFamily: T.sans, fontSize: '13px', color: T.muted, fontWeight: 300 }}>
								Shipping
							</Typography>
							{shippingFree ? (
								<Box
									sx={{
										fontFamily: T.sans,
										fontSize: '11px',
										background: `rgba(192,138,94,0.12)`,
										color: T.gold,
										px: '8px',
										py: '2px',
										borderRadius: '2px',
										fontWeight: 500,
										letterSpacing: '0.06em',
										textTransform: 'uppercase',
									}}
									component="span"
								>
									Free
								</Box>
							) : (
								<Typography sx={{ fontFamily: T.sans, fontSize: '13px', color: T.muted, fontWeight: 300 }}>
									Calculated at checkout
								</Typography>
							)}
						</Box>
					</Box>

					<Divider sx={{ borderColor: T.border, mb: '14px' }} />

					{/* Total */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: '18px' }}>
						<Typography
							sx={{
								fontFamily: T.sans,
								fontSize: '11px',
								letterSpacing: '0.12em',
								textTransform: 'uppercase',
								color: T.dark,
								fontWeight: 500,
							}}
						>
							Total
						</Typography>
						<Typography
							sx={{
								fontFamily: T.serif,
								fontSize: '26px',
								fontWeight: 400,
								color: T.dark,
								letterSpacing: '-0.5px',
							}}
						>
							${subtotal.toFixed(2)}
						</Typography>
					</Box>

					{/* Checkout button */}
					<Button
						fullWidth
						onClick={goToCheckout}
						endIcon={<ArrowForwardRoundedIcon />}
						sx={{
							height: 48,
							borderRadius: '2px',
							background: T.pink,
							color: '#fff',
							fontFamily: T.sans,
							fontSize: '12px',
							fontWeight: 500,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							mb: '12px',
							'&:hover': { background: '#e04d95' },
						}}
					>
						Checkout
					</Button>

					<Typography
						sx={{
							fontFamily: T.sans,
							fontSize: '10.5px',
							color: `rgba(122,112,103,0.55)`,
							textAlign: 'center',
							lineHeight: 1.5,
							letterSpacing: '0.02em',
						}}
					>
						Secure checkout · Taxes calculated at next step
					</Typography>
				</Box>
			)}
		</Drawer>
	);
};

export default BasketModal;
