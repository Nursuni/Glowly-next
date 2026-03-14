import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { Member } from '../../types/member/member';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';

interface TopBrandCardProps {
	brand: Member;
	likeMemberHandler: any;
}

const TopBrandCard = ({ brand, likeMemberHandler }: TopBrandCardProps) => {
	const user = useReactiveVar(userVar);
	const device = useDeviceDetect();

	const initial = brand.memberNick?.charAt(0).toUpperCase() ?? '?';

	const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='60' fill='%23fce8ec'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='44' font-family='Georgia,serif' fill='%23c47a8a'>${initial}</text></svg>`;

	const logo = brand?.memberImage ?? FALLBACK;

	const isLiked = brand?.meLiked?.[0]?.myFavorite;
	if (device === 'mobile') {
		return <> BRAND CARDS</>;
	} else {
		return (
			<Stack className="top-brand-card">
				{/* Brand Logo */}
				<Link
					href={{
						pathname: '/brand/detail',
						query: { memberId: brand._id },
					}}
				>
					<Box className="brand-logo-wrap">
						<img
							src={logo}
							alt={brand.memberNick}
							className="brand-logo"
							onError={(e) => {
								const el = e.target as HTMLImageElement;
								el.onerror = null;
								el.src = FALLBACK;
							}}
						/>
					</Box>
				</Link>

				{/* Brand Name */}
				<Link
					href={{
						pathname: '/brand/detail',
						query: { memberId: brand._id },
					}}
				>
					<strong className="brand-name">{brand.memberNick}</strong>
				</Link>

				<span className="brand-products">{(brand as any).memberProducts ?? 0} items</span>

				{/* Stats */}
				<Box className="brand-stats">
					<Box className="stat">
						<RemoveRedEyeIcon sx={{ width: 14, height: 14 }} />
						<Typography>{(brand as any).memberViews ?? 0}</Typography>
					</Box>

					<Box
						className="stat"
						onClick={(e) => {
							e.stopPropagation();
							likeMemberHandler(user, brand._id);
						}}
						style={{ cursor: 'pointer' }}
					>
						{isLiked ? (
							<FavoriteIcon sx={{ width: 14, height: 14 }} color="primary" />
						) : (
							<FavoriteBorderIcon sx={{ width: 14, height: 14 }} />
						)}
						<Typography>{(brand as any).memberLikes ?? 0}</Typography>
					</Box>
				</Box>
			</Stack>
		);
	}
};
export default TopBrandCard;
