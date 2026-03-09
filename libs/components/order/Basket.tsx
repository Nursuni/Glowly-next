import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Typography, Button, IconButton, Divider } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import withLayoutBasic from '../layout/LayoutBasic';

// ── Mock data (replace with Apollo query) ────────────────────────────────────
const mockItems = [
	{
		_id: '1',
		productId: 'p1',
		productName: 'Rose Glow Serum',
		productBrand: 'Sulwhasoo',
		productImage: '/img/product/serum.jpg',
		unitPrice: 68,
		quantity: 2,
		inStock: true,
	},
	{
		_id: '2',
		productId: 'p2',
		productName: 'Velvet Lip Tint',
		productBrand: 'Romand',
		productImage: '/img/product/lip.jpg',
		unitPrice: 24,
		quantity: 1,
		inStock: true,
	},
	{
		_id: '3',
		productId: 'p3',
		productName: 'Hydra Cushion SPF50',
		productBrand: 'Laneige',
		productImage: '/img/product/cushion.jpg',
		unitPrice: 45,
		quantity: 1,
		inStock: false,
	},
];

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.9;

const BasketPage: NextPage = () => {
	const router = useRouter();
	const [items, setItems] = useState(mockItems);
	const [couponCode, setCouponCode] = useState('');
	const [couponApplied, setCouponApplied] = useState(false);

	/** HANDLERS — replace body with Apollo mutations **/
	const handleQtyChange = (id: string, delta: number) => {
		setItems((prev) =>
			prev
				.map((item) => (item._id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
				.filter((item) => item.quantity > 0),
		);
	};

	const handleRemove = (id: string) => {
		setItems((prev) => prev.filter((item) => item._id !== id));
	};

	const handleCoupon = () => {
		if (couponCode.trim()) setCouponApplied(true);
	};

	const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	const discount = couponApplied ? subtotal * 0.1 : 0;
	const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
	const total = subtotal - discount + shipping;
	const freeShippingLeft = Math.max(0, SHIPPING_THRESHOLD - subtotal);

	const isEmpty = items.length === 0;

	return (
		<div id="basket-page">
			<div className="basket-container">
				{/* ── Page header ── */}
				<div className="basket-header scroll-reveal">
					<span className="basket-eyebrow">✦ Your Selection</span>
					<Typography className="basket-title">Shopping Basket</Typography>
					{!isEmpty && (
						<Typography className="basket-subtitle">
							{items.reduce((s, i) => s + i.quantity, 0)} item
							{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} curated just for you
						</Typography>
					)}
				</div>

				{isEmpty ? (
					/* ── Empty state ── */
					<div className="basket-empty scroll-reveal">
						<div className="empty-icon-wrap">
							<ShoppingBagOutlinedIcon />
						</div>
						<Typography className="empty-title">Your basket is empty</Typography>
						<Typography className="empty-sub">Discover something beautiful to add to your collection.</Typography>
						<Button className="empty-cta" onClick={() => router.push('/catalog')}>
							Explore Products
							<ArrowForwardRoundedIcon />
						</Button>
					</div>
				) : (
					<div className="basket-body">
						{/* ── Left: item list ── */}
						<div className="basket-items-col">
							{/* Free shipping progress */}
							{freeShippingLeft > 0 && (
								<div className="shipping-nudge scroll-reveal">
									<LocalShippingOutlinedIcon />
									<span>
										Add <strong>${freeShippingLeft.toFixed(2)}</strong> more for free shipping
									</span>
									<div className="shipping-bar">
										<div
											className="shipping-bar-fill"
											style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
										/>
									</div>
								</div>
							)}
							{freeShippingLeft === 0 && (
								<div className="shipping-nudge shipping-nudge--done scroll-reveal">
									<LocalShippingOutlinedIcon />
									<span>
										🎉 You've unlocked <strong>free shipping!</strong>
									</span>
								</div>
							)}

							{/* Items */}
							{items.map((item, i) => (
								<div
									className={`basket-item scroll-reveal${!item.inStock ? ' out-of-stock' : ''}`}
									key={item._id}
									style={{ animationDelay: `${i * 70}ms` }}
								>
									{/* Product image */}
									<div className="item-image-wrap">
										<img
											src={item.productImage}
											alt={item.productName}
											className="item-image"
											onError={(e) => {
												(e.target as HTMLImageElement).src = '/img/product/defaultProduct.svg';
											}}
										/>
										{!item.inStock && <div className="item-oos-badge">Out of stock</div>}
									</div>

									{/* Product info */}
									<div className="item-info">
										<span className="item-brand">{item.productBrand}</span>
										<Typography className="item-name">{item.productName}</Typography>
										<Typography className="item-unit-price">${item.unitPrice.toFixed(2)} each</Typography>
									</div>

									{/* Qty + remove */}
									<div className="item-actions">
										<div className="qty-control">
											<IconButton
												size="small"
												className="qty-btn"
												onClick={() => handleQtyChange(item._id, -1)}
												disabled={!item.inStock}
											>
												<RemoveRoundedIcon fontSize="small" />
											</IconButton>
											<span className="qty-value">{item.quantity}</span>
											<IconButton
												size="small"
												className="qty-btn"
												onClick={() => handleQtyChange(item._id, 1)}
												disabled={!item.inStock}
											>
												<AddRoundedIcon fontSize="small" />
											</IconButton>
										</div>

										<Typography className="item-line-total">${(item.unitPrice * item.quantity).toFixed(2)}</Typography>

										<IconButton
											className="remove-btn"
											size="small"
											onClick={() => handleRemove(item._id)}
											aria-label="Remove item"
										>
											<DeleteOutlineRoundedIcon fontSize="small" />
										</IconButton>
									</div>
								</div>
							))}

							{/* Continue shopping */}
							<button className="continue-link" onClick={() => router.push('/catalog')}>
								← Continue shopping
							</button>
						</div>

						{/* ── Right: order summary ── */}
						<div className="basket-summary scroll-reveal">
							<Typography className="summary-title">Order Summary</Typography>

							<div className="summary-rows">
								<div className="summary-row">
									<span>Subtotal</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								{couponApplied && (
									<div className="summary-row summary-row--discount">
										<span>Discount (10%)</span>
										<span>−${discount.toFixed(2)}</span>
									</div>
								)}
								<div className="summary-row">
									<span>Shipping</span>
									<span>{shipping === 0 ? <span className="free-tag">Free</span> : `$${shipping.toFixed(2)}`}</span>
								</div>
							</div>

							<div className="summary-divider" />

							<div className="summary-total">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>

							{/* Coupon */}
							<div className="coupon-wrap">
								<input
									type="text"
									placeholder="Coupon code"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value)}
									className="coupon-input"
									disabled={couponApplied}
								/>
								<button
									className={`coupon-btn${couponApplied ? ' applied' : ''}`}
									onClick={handleCoupon}
									disabled={couponApplied}
								>
									{couponApplied ? '✓ Applied' : 'Apply'}
								</button>
							</div>

							{/* Checkout */}
							<Button
								className="checkout-btn"
								fullWidth
								onClick={() => router.push('/checkout')}
								disabled={items.some((i) => !i.inStock && i.quantity > 0)}
							>
								Proceed to Checkout
								<ArrowForwardRoundedIcon />
							</Button>

							<Typography className="summary-note">
								Secure checkout · Free returns · Authentic products guaranteed
							</Typography>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutBasic(BasketPage);
