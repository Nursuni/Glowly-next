import React from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import { NEXT_PUBLIC_API_URL } from '../../config';

interface TopBrandCardProps {
	brand: Member;
	likeMemberHandler?: any;
}

const TopBrandCard = ({ brand }: TopBrandCardProps) => {
	const device = useDeviceDetect();

	const initial = brand.memberNick?.charAt(0).toUpperCase() ?? '?';
	const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='60' fill='%23fce8ec'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='44' font-family='Georgia,serif' fill='%23c47a8a'>${initial}</text></svg>`;
	const logo = brand?.memberImage ? `${NEXT_PUBLIC_API_URL}/${brand.memberImage}` : FALLBACK;

	if (device === 'mobile') return <></>;

	return (
		<Stack className="top-brand-card">
			<Link href={{ pathname: '/brand/detail', query: { brandId: brand._id } }}>
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

			<Link href={{ pathname: '/brand/detail', query: { brandId: brand._id } }} className="brand-name-link">
				<strong className="brand-name">{brand.memberFullName || brand.memberNick}</strong>
				{brand.memberFullName && <span className="brand-nick">@{brand.memberNick}</span>}
			</Link>
		</Stack>
	);
};

export default TopBrandCard;
