import React from 'react';
import { Stack, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';

interface TopProductCardProps {
	product: Product;
	onLike?: (productId: string) => void;
}

const TopProductCard = ({ product, onLike }: TopProductCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	if (!product) return null;

	const firstImage = product?.productImages?.[0] ?? '';
	const isLiked = product?.meLiked?.[0]?.myFavorite ?? false;
	const price = product?.productPrice ? `$${Number(product.productPrice).toFixed(0)}` : '';

	const redirectHandler = () => {
		router.push(`/catalog/detail?productId=${product._id}`);
	};

	const likeHandler = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!user?._id) return;
		onLike?.(product._id);
	};

	return (
		<Stack className="top-card-box" onClick={redirectHandler}>
			{/* ── Image ── */}
			<Box className="top-card-img-wrap">
				<Box className="top-card-img" style={{ backgroundImage: `url(${REACT_APP_API_URL}/${firstImage})` }} />
				<Box className="top-card-overlay" />

				{/* Category pill — top left */}
				{product.productCategory && <span className="top-card-category">{product.productCategory}</span>}

				{/* Price chip — bottom left */}
				{price && <span className="top-card-price">{price}</span>}

				{/* CTA — slides up on hover */}
				<Box className="top-card-cta">
					<span>Shop Now →</span>
				</Box>
			</Box>

			{/* ── Info ── */}
			<Box className="top-card-info">
				{/* Brand + skin tags row */}
				<Box className="top-card-meta-row">
					{product.productType && <span className="top-card-brand">{product.productType}</span>}
					{product.skinType && product.skinType.length > 0 && (
						<Box className="top-card-skin-tags">
							{product.skinType.slice(0, 2).map((type) => (
								<span key={type} className="top-card-skin-tag">
									{type.charAt(0) + type.slice(1).toLowerCase()}
								</span>
							))}
						</Box>
					)}
				</Box>

				{/* Title */}
				<strong className="top-card-title">{product.productTitle ?? 'Product Name'}</strong>

				{/* Desc */}
				{product.productDesc && <p className="top-card-desc">{product.productDesc}</p>}

				{/* Divider */}
				<Box className="top-card-divider" />

				{/* Bottom stats */}
				<Box className="top-card-bottom">
					<Box className="top-card-stats">
						<Box className="top-stat-item">
							<RemoveRedEyeIcon className="top-stat-icon" />
							<span className="top-stat-count">{product?.productViews ?? 0}</span>
						</Box>

						<Box className="top-stat-item">
							<IconButton className="top-like-btn" onClick={likeHandler} disableRipple>
								{isLiked ? (
									<FavoriteIcon className="top-like-icon active" />
								) : (
									<FavoriteBorderIcon className="top-like-icon" />
								)}
							</IconButton>
							<span className="top-stat-count">{product?.productLikes ?? 0}</span>
						</Box>
					</Box>
					<Box className="top-card-arrow">→</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default TopProductCard;
