import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopSellerProps {
	seller: Member;
}

const TopSellerCard = (props: TopSellerProps) => {
	const { seller } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const sellerImage = seller?.memberImage
		? `${process.env.REACT_APP_API_URL}/${seller?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const redirectHandler = () => {
		router.push(`/seller/detail?sellerId=${seller?._id}`);
	};

	return (
		<Stack className="top-seller-card" onClick={redirectHandler} style={{ cursor: 'pointer' }}>
			<img src={sellerImage} alt="" />

			<strong>{seller?.memberNick}</strong>
			<span>{seller?.memberType}</span>
		</Stack>
	);
};

export default TopSellerCard;
