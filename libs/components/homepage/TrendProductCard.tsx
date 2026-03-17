import React from 'react';
import { Stack, Box, Divider } from '@mui/material';
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
		if (!productId) return;
		router.push({
			pathname: '/catalog/detail',
			query: { productId },
		});
	};

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
	const secondImage = product?.productImages?.[1] ?? product?.productImages?.[0];

	const formattedPrice = product?.productPrice ? `$${Number(product.productPrice).toLocaleString()}` : '';

	const isLiked = product?.meLiked && product?.meLiked[0]?.myFavorite;

	return (
		<Stack className="trend-card-box" onClick={() => product?._id && redirectHandler(product._id)}>
			{/* ── Image ── */}
			<Box className="card-img-wrap">
				<Box
					className="card-img card-img--primary"
					style={{
						backgroundImage: firstImage ? `url(${NEXT_PUBLIC_API_URL}/${firstImage})` : 'none',
					}}
				/>
				<Box
					className="card-img card-img--secondary"
					style={{
						backgroundImage: secondImage ? `url(${NEXT_PUBLIC_API_URL}/${secondImage})` : 'none',
					}}
				/>
				<Box className="card-overlay" />
				<span className="card-badge">new</span>
				{formattedPrice && <span className="card-price">{formattedPrice}</span>}
				<Box className="card-quick-view">
					<span>View Details</span>
				</Box>
			</Box>

			{/* ── Info ── */}
			<Box className="card-info">
				<strong className="card-title">{product.productTitle ?? 'Product Name'}</strong>

				{/* Clamped to 2 lines — inline style guarantees it regardless of SCSS load order */}
				<p
					className="card-desc"
					style={{
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'normal',
					}}
				>
					{product.productDesc ?? 'No description available.'}
				</p>

				<Divider className="card-divider" />

				<Box className="card-bottom">
					<Box className="card-stats">
						<Box className="stat-item">
							<RemoveRedEyeIcon className="stat-icon" />
							<span className="stat-count">{product?.productViews ?? 0}</span>
						</Box>

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

					<span className="card-arrow">→</span>
				</Box>
			</Box>
		</Stack>
	);
};

export default TrendProductCard;
