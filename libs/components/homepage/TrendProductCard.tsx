import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: any;
}

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const redirectHandler = () => {
		router.push(`/catalog/detail?productId=${product._id}`);
	};
	const firstImage = product?.productImages?.[0];

	const formattedPrice = product?.productPrice ? `$${Number(product.productPrice).toLocaleString()}` : '';

	const isLiked = product?.meLiked && product?.meLiked[0]?.myFavorite;

	return (
		<Stack className="trend-card-box" key={product._id} onClick={redirectHandler}>
			{/* Image Section */}
			<Box className="card-img-wrap">
				<Box
					className="card-img"
					style={{
						backgroundImage: firstImage ? `url(${REACT_APP_API_URL}/${firstImage})` : 'none',
					}}
				>
					{/* Hover overlay */}
					<Box className="card-overlay" />

					{/* Category tag */}
					{product.productCategory && <span className="card-category">{product.productCategory}</span>}

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

				{/* Meta row */}
				<Box className="card-meta">
					<Box className="meta-dot" />
					<Box className="meta-item">
						<span className="meta-label">Status</span>
						<span className={`meta-value status-${(product.productStatus ?? 'available').toLowerCase()}`}>
							{product.productStatus ?? 'Available'}
						</span>
					</Box>
				</Box>

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
