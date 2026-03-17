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

interface ProductCardType {
	product: Product;
	likeProductHandler?: (user: any, productId: string) => void;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProductCard = ({ product, likeProductHandler, myFavorites, recentlyVisited }: ProductCardType) => {
	const user = useReactiveVar(userVar);

	const imagePath = product?.productImages[0]
		? `${NEXT_PUBLIC_API_URL}/${product.productImages[0]}`
		: '/img/banner/header1.svg';

	return (
		<Stack className="card-config">
			{/* Top Section - Image + Price */}
			<Stack className="top">
				<Link href={{ pathname: '/catalog/detail', query: { productId: product._id } }}>
					<img src={imagePath} alt={product.productTitle} className="product-image" />
				</Link>
				<Box className="price-box">
					<Typography className="price">{formatterStr(product.productPrice)}₩</Typography>
				</Box>
			</Stack>

			{/* Bottom Section - Info + Icons */}
			<Stack className="bottom" spacing={1}>
				<Stack className="name-address">
					<Link href={{ pathname: '/catalog/detail', query: { productId: product._id } }}>
						<Typography className="title">{product.productTitle}</Typography>
					</Link>
					<Typography className="subtitle">
						{product.productType || 'N/A'} | {product.productTarget || 'N/A'} | {(product.ageRange || []).join(', ')}
					</Typography>
				</Stack>

				{/* Additional Product Info */}
				<Stack className="product-info" direction="row" flexWrap="wrap" spacing={0.5}>
					{product.volume && product.volumeUnit && (
						<Chip label={`Volume: ${product.volume}${product.volumeUnit}`} size="small" />
					)}
					{(product.skinType || []).map((s, idx) => (
						<Chip key={idx} label={`Skin: ${s}`} size="small" />
					))}
					{(product.ingredientType || []).map((i, idx) => (
						<Chip key={idx} label={`Ingredient: ${i}`} size="small" />
					))}
				</Stack>

				<Stack className="type-buttons" direction="row" justifyContent="space-between" alignItems="center">
					<Stack direction="row" spacing={1} alignItems="center">
						{!recentlyVisited && (
							<>
								<IconButton color="default">
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography>{product.productViews}</Typography>

								<IconButton color="default" onClick={() => likeProductHandler && likeProductHandler(user, product._id)}>
									{myFavorites || (product.meLiked && product.meLiked[0]?.myFavorite) ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography>{product.productLikes}</Typography>

								<IconButton color="default">
									<CommentIcon />
								</IconButton>
								<Typography>{product.productComments}</Typography>
							</>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ProductCard;
