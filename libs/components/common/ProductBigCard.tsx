import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Product } from '../../types/product/product';
import { NEXT_PUBLIC_API_URL } from '../../config';

const topProductRank = 4.5;

interface ProductBigCardProps {
	product: Product;
	likeProductHandler: any;
}

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goProductDetailPage = (productId: string) => {
		router.push(`/catalog/detail?productId=${productId}`);
	};

	if (device === 'mobile') {
		return <div> BIG CARD</div>;
	} else {
		return (
			<Stack className="product-big-card-box" onClick={() => goProductDetailPage(product?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${NEXT_PUBLIC_API_URL}/${product?.productImages?.[0]})` }}
				>
					<div className={'price'}>${formatterStr(product?.productPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>productTitle</strong>

					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{product?.productViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.stopPropagation();
									if (!product?._id) return;
									likeProductHandler(user, product._id);
								}}
							>
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
	}
};

export default ProductBigCard;
