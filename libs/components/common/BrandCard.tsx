import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface BrandCard {
	brand: any;
	likeMemberHandler: any;
}

const BrandCard = (props: BrandCard) => {
	const { brand, likeMemberHandler } = props;

	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = brand?.memberImage ? `${REACT_APP_API_URL}/${brand?.memberImage}` : '/img/profile/user.svg';

	if (device === 'mobile') {
		return (
			<Stack className="brand-general-card">
				<Link
					href={{
						pathname: '/brand/detail',
						query: { brandId: brand?._id },
					}}
				>
					<Box
						component={'div'}
						className={'brand-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<div>{brand?.memberProducts} products</div>
					</Box>
				</Link>

				<Stack className={'brand-desc'}>
					<Box component={'div'} className={'brand-info'}>
						<Link
							href={{
								pathname: '/brand/detail',
								query: { brandId: brand?._id },
							}}
						>
							<strong>{brand?.memberFullName ?? brand?.memberNick}</strong>
						</Link>
						<span>brand</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<Box className={'stat-item'}>
							<RemoveRedEyeIcon fontSize="small" />
							<Typography className="view-cnt">{brand?.memberViews}</Typography>
						</Box>
						<Box className={'stat-item'} onClick={() => likeMemberHandler(user, brand?._id)}>
							{brand?.meLiked && brand?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} fontSize="small" />
							) : (
								<FavoriteBorderIcon fontSize="small" />
							)}
							<Typography className="view-cnt">{brand?.memberLikes}</Typography>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="brand-general-card">
				<Link
					href={{
						pathname: '/brand/detail',
						query: { brandId: brand?._id },
					}}
				>
					<Box
						component={'div'}
						className={'brand-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<div>{brand?.memberProducts} products</div>
					</Box>
				</Link>

				<Stack className={'brand-desc'}>
					<Box component={'div'} className={'brand-info'}>
						<Link
							href={{
								pathname: '/brand/detail',
								query: { brandId: brand?._id },
							}}
						>
							<strong>{brand?.memberFullName ?? brand?.memberNick}</strong>
						</Link>
						<span>brand</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{brand?.memberViews}</Typography>
						<IconButton color={'default'} onClick={() => likeMemberHandler(user, brand?._id)}>
							{brand?.meLiked && brand?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{brand?.memberLikes}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default BrandCard;
