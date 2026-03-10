import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

const OrderSuccessPage: NextPage = () => {
	const router = useRouter();
	const { orderId } = router.query;

	return (
		<Box
			sx={{
				maxWidth: 600,
				margin: '80px auto',
				textAlign: 'center',
				padding: '20px',
			}}
		>
			<Paper sx={{ padding: '40px', borderRadius: '16px' }}>
				<CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />

				<Typography variant="h4" fontWeight={600} mb={2}>
					Thank You for Your Order!
				</Typography>

				<Typography mb={3}>
					We sincerely appreciate your purchase. Your order has been placed successfully and is being processed.
				</Typography>

				{orderId && (
					<Typography mb={3} color="text.secondary">
						Your Order ID: <b>{orderId}</b>
					</Typography>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<Button variant="contained" onClick={() => router.push('/catalog')}>
						Continue Shopping
					</Button>

					<Button variant="outlined" onClick={() => router.push('/orders')}>
						View My Purchases
					</Button>
				</Box>

				<Typography mt={3} color="text.secondary">
					If you have any questions or need assistance, please feel free to contact us.
				</Typography>
			</Paper>
		</Box>
	);
};

export default withLayoutBasic(OrderSuccessPage);
