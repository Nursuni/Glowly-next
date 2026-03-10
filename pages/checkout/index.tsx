import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { TextField, Button, Stack, Typography, Box, Divider } from '@mui/material';
import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

const CheckoutPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

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

	return (
		<Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
			<Typography variant="h4" mb={4}>
				Checkout
			</Typography>

			<Box sx={{ display: 'flex', gap: 6 }}>
				{/* LEFT SIDE — CUSTOMER FORM */}
				<Box sx={{ flex: 2 }}>
					<Typography variant="h6" mb={2}>
						Shipping Information
					</Typography>

					<Stack spacing={2}>
						<TextField label="Full Name" fullWidth />
						<TextField label="Email" fullWidth />
						<TextField label="Phone Number" fullWidth />
						<TextField label="Address" fullWidth />
						<TextField label="City" fullWidth />

						<Stack direction="row" spacing={2}>
							<TextField label="Postal Code" fullWidth />
							<TextField label="Country" fullWidth />
						</Stack>

						<Button variant="contained" size="large">
							Place Order
						</Button>
					</Stack>
				</Box>

				{/* RIGHT SIDE — ORDER SUMMARY */}
				<Box
					sx={{
						flex: 1,
						background: '#fafafa',
						padding: '25px',
						borderRadius: '12px',
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
				</Box>
			</Box>
		</Box>
	);
};

export default withLayoutBasic(CheckoutPage);
