import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

import { TextField, Button, Stack, Typography, Box, Divider, Paper } from '@mui/material';

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
		const fakeOrderId = 'ORD-' + Date.now();

		router.push(`/order-success?orderId=${fakeOrderId}`);
	};
	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: 2 }}>
			<Typography variant="h4" mb={4}>
				Checkout
			</Typography>

			<Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
				{/* FORM */}
				<Box sx={{ flex: 2, minWidth: 320 }}>
					<Typography variant="h6" mb={2}>
						Shipping Information
					</Typography>

					<Stack spacing={2}>
						<TextField label="Full Name" fullWidth onChange={handleChange('name')} />
						<TextField label="Email" fullWidth onChange={handleChange('email')} />
						<TextField label="Phone Number" fullWidth onChange={handleChange('phone')} />
						<TextField label="Address" fullWidth onChange={handleChange('address')} />
						<TextField label="City" fullWidth onChange={handleChange('city')} />

						<Stack direction="row" spacing={2}>
							<TextField label="Postal Code" fullWidth onChange={handleChange('postal')} />
							<TextField label="Country" fullWidth onChange={handleChange('country')} />
						</Stack>

						<Button variant="contained" size="large" onClick={handleOrder}>
							Place Order
						</Button>
					</Stack>
				</Box>

				{/* SUMMARY */}
				<Paper
					elevation={0}
					sx={{
						flex: 1,
						minWidth: 280,
						bgcolor: '#fafafa',
						p: 3,
						borderRadius: 3,
					}}
				>
					<Typography variant="h6">Order Summary</Typography>

					<Box mt={2}>
						{cartItems.map((item) => (
							<Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<span>
									{item.name} × {item.qty}
								</span>
								<span>${item.price * item.qty}</span>
							</Box>
						))}
					</Box>

					<Divider sx={{ my: 2 }} />

					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>Subtotal</span>
						<span>${subtotal}</span>
					</Box>

					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>Shipping</span>
						<span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
					</Box>

					<Divider sx={{ my: 2 }} />

					<Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
						<span>Total</span>
						<span>${total}</span>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
};

export default withLayoutBasic(CheckoutPage);
