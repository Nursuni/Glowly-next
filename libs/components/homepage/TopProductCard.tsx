import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';

interface TopProductCardProps {
	product: Product;
}

const TopProductCard = (props: TopProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	if (!product) return null;

	const firstImage = product?.productImages?.[0] ?? '';

	const renderCard = () => (
		<Stack className="top-card-box">
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${firstImage})` }}
			>
				<div>${product?.productPrice}</div>
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'}>title</strong>
				<p className={'desc'}>{product?.productDesc ?? 'No description'}</p>

				<Divider sx={{ mt: '15px', mb: '17px' }} />
				<div className={'bott'}>
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

	return device === 'mobile' ? renderCard() : renderCard();
};

export default TopProductCard;
