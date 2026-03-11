import React from 'react';
import { Stack } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Member } from '../../types/member/member';

interface TopBrandCardProps {
	brand: Member;
	likeMemberHandler?: (user: any, id: string) => void;
}

const TopBrandCard = ({ brand, likeMemberHandler }: TopBrandCardProps) => {
	const initial = brand.memberNick?.charAt(0).toUpperCase() ?? '?';
	const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='60' fill='%23fce8ec'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='44' font-family='Georgia,serif' fill='%23c47a8a'>${initial}</text></svg>`;
	const logo = (brand?.memberImage as any) ?? FALLBACK;

	return (
		<div className={'top-brand-card'}>
			<div className="{container}">
				<div className={'brand-logo-wrap'}>
					<img
						src={logo}
						alt={brand.memberNick}
						className={'brand-logo'}
						onError={(e) => {
							const el = e.target as HTMLImageElement;
							el.onerror = null;
							el.src = FALLBACK;
						}}
					/>
				</div>

				<strong className={'brand-name'}>{brand.memberNick}</strong>
				<span className={'brand-products'}>{(brand as any).memberProducts ?? 0} items</span>

				<Stack className={'brand-stats'}>
					<div className={'stat'}>
						<RemoveRedEyeIcon sx={{ width: 13, height: 13 }} />
						<span>{(brand as any).memberViews ?? 0}</span>
					</div>
					<div className={'stat'}>
						<FavoriteIcon
							sx={{ width: 13, height: 13 }}
							onClick={() => likeMemberHandler && likeMemberHandler(null, brand._id)}
							style={{ cursor: likeMemberHandler ? 'pointer' : 'default' }}
						/>
						<span>{(brand as any).memberLikes ?? 0}</span>
					</div>
				</Stack>
			</div>
		</div>
	);
};

export default TopBrandCard;
