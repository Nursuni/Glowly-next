import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopBrandProps {
	brand: Member;
}

const TopBrandCard = (props: TopBrandProps) => {
	const { brand } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const brandImage = brand?.memberImage
		? `${process.env.REACT_APP_API_URL}/${brand?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const redirectHandler = () => {
		router.push(`/brand/detail?brandId=${brand?._id}`);
	};

	return (
		<Stack className="top-brand-card" onClick={redirectHandler} style={{ cursor: 'pointer' }}>
			<img src={brandImage} alt="" />

			<strong>{brand?.memberNick}</strong>
			<span>{brand?.memberType}</span>
		</Stack>
	);
};

export default TopBrandCard;
