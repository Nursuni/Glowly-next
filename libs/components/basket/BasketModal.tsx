import React, { useState } from 'react';
import { Drawer, IconButton, Typography, Button } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useRouter } from 'next/router';
const mockItems = [
	{
		_id: '1',
		productName: 'Rose Glow Serum',
		productBrand: 'Sulwhasoo',
		productImage: '/img/product/serum.jpg',
		unitPrice: 68,
		quantity: 1,
		inStock: true,
	},
	{
		_id: '2',
		productName: 'Velvet Lip Tint',
		productBrand: 'Romand',
		productImage: '/img/product/lip.jpg',
		unitPrice: 24,
		quantity: 2,
		inStock: true,
	},
];
interface BasketModalProps {
	open: boolean;
	onClose: () => void;
}
const BasketModal: React.FC<BasketModalProps> = ({ open, onClose }) => {
	const router = useRouter();
	const [items, setItems] = useState(mockItems);
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
	const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			{' '}
			<div style={{ width: 380, height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
				{' '}
				{/* Header */}{' '}
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
					{' '}
					<ShoppingBagOutlinedIcon /> <Typography style={{ marginLeft: 8, fontWeight: 600 }}>
						{' '}
						Your Basket{' '}
					</Typography>{' '}
				</div>{' '}
				{/* Items */}{' '}
				<div style={{ flex: 1, overflowY: 'auto' }}>
					{' '}
					{items.length === 0 && <Typography>Your basket is empty.</Typography>}{' '}
					{items.map((item) => (
						<div key={item._id} style={{ display: 'flex', marginBottom: 16, gap: 12, alignItems: 'center' }}>
							{' '}
							<img src={item.productImage} style={{ width: 60, height: 60, objectFit: 'cover' }} />{' '}
							<div style={{ flex: 1 }}>
								{' '}
								<Typography style={{ fontSize: 14 }}> {item.productBrand} </Typography>{' '}
								<Typography style={{ fontWeight: 500 }}> {item.productName} </Typography>{' '}
								<Typography style={{ fontSize: 13 }}> ${item.unitPrice} </Typography> {/* Qty */}{' '}
								<div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
									{' '}
									<IconButton size="small" onClick={() => handleQtyChange(item._id, -1)}>
										{' '}
										<RemoveRoundedIcon fontSize="small" />{' '}
									</IconButton>{' '}
									<span>{item.quantity}</span>{' '}
									<IconButton size="small" onClick={() => handleQtyChange(item._id, 1)}>
										{' '}
										<AddRoundedIcon fontSize="small" />{' '}
									</IconButton>{' '}
								</div>{' '}
							</div>{' '}
							{/* Remove */}{' '}
							<IconButton onClick={() => handleRemove(item._id)}>
								{' '}
								<DeleteOutlineRoundedIcon />{' '}
							</IconButton>{' '}
						</div>
					))}{' '}
				</div>{' '}
				{/* Summary */}{' '}
				<div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
					{' '}
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
						{' '}
						<Typography>Subtotal</Typography> <Typography>${subtotal.toFixed(2)}</Typography>{' '}
					</div>{' '}
					<Button
						fullWidth
						variant="contained"
						onClick={() => {
							onClose();
							router.push('/checkout');
						}}
					>
						{' '}
						Checkout <ArrowForwardRoundedIcon style={{ marginLeft: 6 }} />{' '}
					</Button>{' '}
				</div>{' '}
			</div>{' '}
		</Drawer>
	);
};
export default BasketModal;
