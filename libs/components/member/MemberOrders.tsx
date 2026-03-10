import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '@/apollo/user/query';

const MyOrders = () => {
	const { data, loading } = useQuery(GET_MY_ORDERS, {
		variables: {
			input: {
				page: 1,
				limit: 10,
			},
		},
	});

	if (loading) return <div>Loading...</div>;

	const orders = data?.getMyOrders ?? [];

	return (
		<Stack>
			<Typography variant="h5" mb={3}>
				My Purchases
			</Typography>

			{orders.length === 0 ? (
				<Typography>No orders yet.</Typography>
			) : (
				orders.map((order: any) => (
					<Box
						key={order._id}
						sx={{
							border: '1px solid #ddd',
							borderRadius: '10px',
							padding: '20px',
							marginBottom: '20px',
						}}
					>
						<Typography>
							Order ID: <b>{order._id}</b>
						</Typography>

						<Typography>Status: {order.orderStatus}</Typography>

						<Typography>Total: ${order.totalPrice}</Typography>

						<Typography>Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
					</Box>
				))
			)}
		</Stack>
	);
};

export default MyOrders;
