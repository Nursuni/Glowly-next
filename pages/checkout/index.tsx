import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

import { TextField, Button, Stack, Typography, Box, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

const CheckoutPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		postal: '',
		country: '',
	});

	useEffect(() => {
		if (!router.isReady) return;
		if (!user) router.push('/login?redirect=checkout');
	}, [user, router]);

	if (!user) return null;

	const cartItems = [
		{ id: 1, name: 'Glow Serum', price: 32, qty: 1 },
		{ id: 2, name: 'Lip Tint', price: 18, qty: 2 },
	];

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const shipping = subtotal > 50 ? 0 : 5;
	const total = subtotal + shipping;

	const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [field]: e.target.value });
	};

	const handleOrder = () => {
		router.push(`/order-success?orderId=ORD-${Date.now()}`);
	};

	return (
		<div id="pc-wrap">
			<div id="checkout-page">
				<div className="checkout-container">
					{/* ── Page header ── */}
					<div className="checkout-header">
						<span className="checkout-eyebrow">Secure Checkout</span>
						<Typography className="checkout-title">Complete Your Order</Typography>
						<Typography className="checkout-subtitle">
							Your information is protected with 256-bit SSL encryption
						</Typography>
					</div>

					<div className="checkout-body">
						{/* ── LEFT: form ── */}
						<div className="checkout-form-col">
							{/* Section: Shipping */}
							<div className="form-section">
								<div className="form-section-label">
									<LocalShippingOutlinedIcon className="section-icon" />
									<span>Shipping Information</span>
								</div>

								<Stack spacing="14px">
									<TextField
										label="Full Name"
										fullWidth
										variant="outlined"
										onChange={handleChange('name')}
										className="glowly-input"
									/>
									<Box sx={{ display: 'flex', gap: '14px' }}>
										<TextField
											label="Email Address"
											fullWidth
											variant="outlined"
											onChange={handleChange('email')}
											className="glowly-input"
										/>
										<TextField
											label="Phone Number"
											fullWidth
											variant="outlined"
											onChange={handleChange('phone')}
											className="glowly-input"
										/>
									</Box>
									<TextField
										label="Street Address"
										fullWidth
										variant="outlined"
										onChange={handleChange('address')}
										className="glowly-input"
									/>
									<Box sx={{ display: 'flex', gap: '14px' }}>
										<TextField
											label="City"
											fullWidth
											variant="outlined"
											onChange={handleChange('city')}
											className="glowly-input"
										/>
										<TextField
											label="Postal Code"
											fullWidth
											variant="outlined"
											onChange={handleChange('postal')}
											className="glowly-input"
										/>
										<TextField
											label="Country"
											fullWidth
											variant="outlined"
											onChange={handleChange('country')}
											className="glowly-input"
										/>
									</Box>
								</Stack>
							</div>

							{/* Trust badges */}
							<div className="trust-row">
								{['Free Returns', 'Secure Payment', 'Fast Delivery'].map((badge) => (
									<div className="trust-badge" key={badge}>
										<CheckCircleOutlineRoundedIcon className="trust-icon" />
										<span>{badge}</span>
									</div>
								))}
							</div>
						</div>

						{/* ── RIGHT: summary ── */}
						<div className="checkout-summary">
							<Typography className="summary-title">Order Summary</Typography>

							{/* Items */}
							<div className="summary-items">
								{cartItems.map((item) => (
									<div className="summary-item" key={item.id}>
										<div className="summary-item-img" />
										<div className="summary-item-info">
											<span className="summary-item-name">{item.name}</span>
											<span className="summary-item-qty">Qty {item.qty}</span>
										</div>
										<span className="summary-item-price">${item.price * item.qty}</span>
									</div>
								))}
							</div>

							<Divider className="summary-divider" />

							{/* Rows */}
							<div className="summary-rows">
								<div className="summary-row">
									<span>Subtotal</span>
									<span>${subtotal}</span>
								</div>
								<div className="summary-row">
									<span>Shipping</span>
									<span className={shipping === 0 ? 'free-tag' : ''}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
								</div>
							</div>

							<Divider className="summary-divider" />

							{/* Total */}
							<div className="summary-total">
								<span>Total</span>
								<span className="total-amount">${total}</span>
							</div>

							{/* CTA */}
							<Button fullWidth onClick={handleOrder} endIcon={<ArrowForwardRoundedIcon />} className="place-order-btn">
								Place Order
							</Button>

							{/* Lock note */}
							<div className="secure-note">
								<LockOutlinedIcon className="lock-icon" />
								<span>Payments are secure &amp; encrypted</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(CheckoutPage);
