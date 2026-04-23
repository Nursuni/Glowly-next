import React from 'react';
import { Stack, Typography, Box, IconButton, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CommentIcon from '@mui/icons-material/Comment';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface CatalogProductCardType {
	product: Product;
	likeProductHandler?: (user: any, productId: string) => void;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CatalogProductCard = ({ product, likeProductHandler, myFavorites, recentlyVisited }: CatalogProductCardType) => {
	const user = useReactiveVar(userVar);

	const imagePath = product?.productImages[0]
		? `${NEXT_PUBLIC_API_URL}/${product.productImages[0]}`
		: '/img/banner/header1.svg';

	return (
		<Stack className="card-config">
			{/* Floating Image Area */}
			<Box className="card-top">
				<Link href={{ pathname: '/catalog/detail', query: { productId: product._id } }}>
					<img src={imagePath} alt={product.productTitle} className="product-image" />
				</Link>
				<Box className="price-badge">{formatterStr(product.productPrice)}₩</Box>
			</Box>

			{/* Seamless Description Area */}
			<Stack className="bottom">
				<Box className="name-address">
					<Typography className="title">{product.productTitle}</Typography>
					<Typography className="subtitle">
						{product.productType} &nbsp;•&nbsp; {product.productTarget}
					</Typography>
				</Box>

				<Stack className="product-info" direction="row">
					{product.volume && <Chip className="chip-custom" label={`${product.volume}${product.volumeUnit}`} />}
					{product.skinType?.slice(0, 1).map((s, idx) => (
						<Chip key={idx} className="chip-custom" label={s} />
					))}
				</Stack>

				<div className="divider" />

				<Box className="action-row">
					<div className="stats-group">
						<div className="stat-item">
							<RemoveRedEyeIcon /> <span>{product.productViews}</span>
						</div>
						<div className="stat-item">
							<CommentIcon /> <span>{product.productComments}</span>
						</div>
					</div>

					<IconButton className="like-btn" size="small" onClick={() => likeProductHandler?.(user, product._id)}>
						{myFavorites || product.meLiked?.[0]?.myFavorite ? (
							<FavoriteIcon sx={{ color: 'var(--card-accent)', fontSize: 18 }} />
						) : (
							<FavoriteBorderIcon sx={{ fontSize: 18 }} />
						)}
					</IconButton>
				</Box>
			</Stack>
		</Stack>
	);
};

export default CatalogProductCard;
