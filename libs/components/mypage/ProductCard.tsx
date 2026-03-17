import React, { useState } from 'react';
import {
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Stack,
} from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { Product } from '../../types/product/product';
import { ProductStatus } from '../../enums/product.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { formatterStr } from '../../utils';

interface ProductCardProps {
	product: Product;
	deleteProductHandler?: any;
	memberPage?: boolean;
	updateProductHandler?: any;
	likeProductHandler?: any;
}

export const ProductCard = (props: ProductCardProps) => {
	const { product, deleteProductHandler, memberPage, updateProductHandler } = props;
	const router = useRouter();
	const device = useDeviceDetect();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const pushProductDetail = async (id: string) => {
		if (memberPage) {
			await router.push({ pathname: '/catalog/detail', query: { productId: id } });
		} else {
			await router.push({ pathname: '/catalog/detail', query: { productId: id } });
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	if (device === 'mobile') return <div>MOBILE Product CARD</div>;

	function pushEditProduct(_id: string): void {
		throw new Error('Function not implemented.');
	}

	return (
		<Card
			sx={{
				maxWidth: 280,
				borderRadius: 3,
				boxShadow: 3,
				position: 'relative',
				cursor: 'pointer',
				transition: 'transform 0.2s',
				'&:hover': { transform: 'scale(1.02)' },
			}}
		>
			{/* Product Image */}
			<CardMedia
				component="img"
				height="180"
				image={`${process.env.NEXT_PUBLIC_API_URL}/${product.productImages[0]}`}
				alt={product.productTitle}
				onClick={() => pushProductDetail(product._id)}
			/>
			<CardContent onClick={() => pushProductDetail(product._id)}>
				<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
					{product.productTitle}
				</Typography>
				<Typography variant="body1" color="primary">
					${formatterStr(product.productPrice)}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					{dayjs(product.createdAt).format('DD MMMM, YYYY')}
				</Typography>
			</CardContent>

			{/* Product Status */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pb: 1 }}>
				<Stack sx={{ background: '#E5F0FD', px: 1.5, py: 0.5, borderRadius: 1 }} onClick={handleClick}>
					<Typography variant="caption" color="#3554d1">
						{product.productStatus}
					</Typography>
				</Stack>

				<Typography variant="caption" color="text.secondary">
					Views: {product.productViews.toLocaleString()}
				</Typography>
			</Stack>

			{/* Action Buttons */}
			{!memberPage && product.productStatus === ProductStatus.ACTIVE && (
				<CardActions sx={{ justifyContent: 'flex-end', px: 1 }}>
					<IconButton onClick={() => pushEditProduct(product._id)} size="small">
						<ModeIcon fontSize="small" />
					</IconButton>
					<IconButton onClick={() => deleteProductHandler(product._id)} size="small">
						<DeleteIcon fontSize="small" />
					</IconButton>
				</CardActions>
			)}

			{/* Status Menu */}
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						width: '90px',
						mt: 1,
						ml: '10px',
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
					},
				}}
			>
				{product.productStatus === 'ACTIVE' && (
					<MenuItem
						onClick={() => {
							handleClose();
							updateProductHandler(ProductStatus.SOLD, product._id);
						}}
					>
						Sold
					</MenuItem>
				)}
			</Menu>
		</Card>
	);
};
