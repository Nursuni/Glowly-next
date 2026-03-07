import React from 'react';
import { Member } from '../../types/member/member';

interface TopBrandCardProps {
	brand: Member;
}

const TopBrandCard = ({ brand }: TopBrandCardProps) => {
	const logo = brand?.memberImage ? `/img/brands/${brand.memberImage}` : '/img/profile/defaultUser.svg';

	return (
		<div style={{ width: '100px', height: '100px', cursor: 'pointer' }}>
			<img
				src={logo}
				alt={brand.memberNick}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain', // fit the logo nicely
					borderRadius: '12px', // optional
				}}
			/>
		</div>
	);
};

export default TopBrandCard;
