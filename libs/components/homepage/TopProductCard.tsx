import React from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { toastError, toastSuccess } from '@/libs/toast';

interface TopProductCardProps {
	product: Product;
	likeProductHandler: (user: any, productId: string) => void;
}

const TopProductCard = ({ product, likeProductHandler }: TopProductCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const firstImage = product.productImages?.[0] ?? '';
	const isLiked = product.meLiked?.[0]?.myFavorite ?? false;
	const price = product.productPrice ? `$${Number(product.productPrice).toFixed(0)}` : '';

	const redirectHandler = (productId: string) => {
		if (!productId) return;
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

	return (
		<Stack className="top-card-box" onClick={() => redirectHandler(product._id)}>
			{/* Image */}
			<Box className="top-card-img-wrap">
				<Box
					className="top-card-img"
					style={{ backgroundImage: firstImage ? `url(${NEXT_PUBLIC_API_URL}/${firstImage})` : 'none' }}
				/>
				<Box className="top-card-overlay" />
				{price && <span className="top-card-price">{price}</span>}

				{/* Shop Now */}
				<Box className="card-actions">
					<button
						className="shop-now-btn"
						onClick={(e) => {
							e.stopPropagation();
							addToBasketHandler(product);
						}}
					>
						<ShoppingCartIcon fontSize="small" /> Shop Now
					</button>
				</Box>
			</Box>

			{/* Info */}
			<Box className="top-card-info">
				{/* Product Type / Skin Type */}
				<Box className="top-card-meta-row">
					{product.productType && <span className="top-card-brand">{product.productType}</span>}
					{product.skinType?.length > 0 && (
						<Box className="top-card-skin-tags">
							{product.skinType.slice(0, 2).map((type) => (
								<span key={type} className="top-card-skin-tag">
									{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
								</span>
							))}
						</Box>
					)}
				</Box>

				{/* Title */}
				<strong className="top-card-title">{product.productTitle ?? 'Product Name'}</strong>

				{/* Description */}
				{product.productDesc && <p className="top-card-desc">{product.productDesc}</p>}

				<Box className="top-card-divider" />

				{/* Bottom Stats */}
				<Box className="top-card-bottom">
					<Box className="top-card-stats">
						{/* Views */}
						<Box className="top-stat-item">
							<RemoveRedEyeIcon className="top-stat-icon" />
							<span className="top-stat-count">{product.productViews ?? 0}</span>
						</Box>

						{/* Likes */}
						<Box className="top-stat-item">
							<IconButton
								className="top-like-btn"
								onClick={(e) => {
									e.stopPropagation();
									likeProductHandler(user, product._id);
								}}
								disableRipple
							>
								{isLiked ? (
									<FavoriteIcon className="top-like-icon active" />
								) : (
									<FavoriteBorderIcon className="top-like-icon" />
								)}
							</IconButton>
							<span className="top-stat-count">{product.productLikes ?? 0}</span>
						</Box>
					</Box>
					<Box className="top-card-arrow">→</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default TopProductCard;
