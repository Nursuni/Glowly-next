import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Product } from '../../types/product/product';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProductCardProps {
	product: Product;
}

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** OPTIONAL: redirect handler */
	const redirectHandler = () => {
		router.push(`/product/detail?productId=${product._id}`);
	};

	return (
		<Stack className="trend-card-box" key={product._id} onClick={redirectHandler}>
			<Box
				component={'div'}
				className={'card-img'}
				style={{
					backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})`,
				}}
			>
				<div>productPrice</div>
			</Box>

			<Box component={'div'} className={'info'}>
				<strong className={'title'}>title</strong>

				<p className={'desc'}>{product.productDesc ?? 'No description'}</p>

				{/* Example product extra info */}
				<div className={'options'}>
					<div>
						<span>Stock: {product.productStock ?? 0}</span>
					</div>
					<div>
						<span>Category: {product.productCategory ?? 'General'}</span>
					</div>
				</div>

				<Divider sx={{ mt: '15px', mb: '17px' }} />

				<div className={'bott'}>
					<p>{product.productStatus ?? 'Available'}</p>

					<div className="view-like-box">
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{product?.productViews}</Typography>

						<IconButton color={'default'}>
							{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: 'red' }} />
							) : (
								<FavoriteIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{product?.productLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default TrendProductCard;
