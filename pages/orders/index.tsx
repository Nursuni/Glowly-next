import React from 'react';
import { NextPage } from 'next';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

// Mock data for now; later you can fetch via Apollo
const mockOrders = [
	{ id: '12345', total: '$49.99', date: '2026-03-10' },
	{ id: '12346', total: '$29.99', date: '2026-03-05' },
];

const OrdersPage: NextPage = () => {
	return (
		<Box sx={{ maxWidth: 800, margin: '80px auto', padding: '20px' }}>
			<Paper sx={{ padding: '40px', borderRadius: '16px' }}>
				<Typography variant="h4" fontWeight={600} mb={3}>
					My Orders
				</Typography>

				{mockOrders.length === 0 ? (
					<Typography>No orders found.</Typography>
				) : (
					<List>
						{mockOrders.map((order) => (
							<ListItem key={order.id} divider>
								<ListItemText
									primary={`Order ID: ${order.id}`}
									secondary={`Total: ${order.total} — Date: ${order.date}`}
								/>
							</ListItem>
						))}
					</List>
				)}
			</Paper>
		</Box>
	);
};

export default withLayoutBasic(OrdersPage);
