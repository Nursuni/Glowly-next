import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { toastError, toastSuccess } from '@/libs/toast';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: (user: any, productId: string) => void;
}

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const redirectHandler = (productId: string) => {
		console.log('productId value:', productId);
		console.log('productId type:', typeof productId);

		if (!productId) {
			console.log('productId is empty or undefined');
			return;
		}

		router.push({
			pathname: '/catalog/detail',
			query: { productId: productId },
		});
	};

	// Add product to basket
	const addToBasketHandler = (product: Product) => {
		const basket = JSON.parse(localStorage.getItem('basket') || '[]');
		const exists = basket.find((item: Product) => item._id === product._id);

		if (!exists) {
			basket.push({ ...product, quantity: 1 });
			localStorage.setItem('basket', JSON.stringify(basket));
			toastSuccess('Added to basket!');
		} else {
			toastError('Product already in basket!');
		}
	};
	const firstImage = product?.productImages?.[0];

	const formattedPrice = product?.productPrice ? `$${Number(product.productPrice).toLocaleString()}` : '';

	const isLiked = product?.meLiked && product?.meLiked[0]?.myFavorite;

	return (
		<Stack
			className="trend-card-box"
			onClick={(e) => {
				e.stopPropagation();
				redirectHandler(product._id);
			}}
		>
			{/* Image Section */}
			<Box className="card-img-wrap" onClick={() => product?._id && redirectHandler(product._id)}>
				<Box
					className="card-img"
					style={{
						backgroundImage: firstImage ? `url(${NEXT_PUBLIC_API_URL}/${firstImage})` : 'none',
					}}
				>
					{/* Hover overlay */}
					<Box className="card-overlay" />

					{/* Price badge */}
					{formattedPrice && <span className="card-price">{formattedPrice}</span>}

					{/* Quick action */}
					<Box className="card-quick-view">
						<span>View Details</span>
					</Box>
				</Box>
			</Box>

			{/* Info Section */}
			<Box className="card-info">
				{/* Title */}
				<strong className="card-title">{product.productTitle ?? 'Product Name'}</strong>

				{/* Description */}
				<p className="card-desc">{product.productDesc ?? 'No description available.'}</p>

				<Divider className="card-divider" />

				{/* Bottom row */}
				<Box className="card-bottom">
					<Box className="card-stats">
						{/* Views */}
						<Box className="stat-item">
							<RemoveRedEyeIcon className="stat-icon" />
							<span className="stat-count">{product?.productViews ?? 0}</span>
						</Box>

						{/* Likes */}
						<Box className="stat-item">
							<IconButton
								className={`like-btn ${isLiked ? 'liked' : ''}`}
								onClick={(e) => {
									e.stopPropagation();
									likeProductHandler(user, product?._id);
								}}
								disableRipple
							>
								{isLiked ? <FavoriteIcon className="like-icon active" /> : <FavoriteBorderIcon className="like-icon" />}
							</IconButton>
							<span className="stat-count">{product?.productLikes ?? 0}</span>
						</Box>
					</Box>

					<Box className="card-arrow">→</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default TrendProductCard;
