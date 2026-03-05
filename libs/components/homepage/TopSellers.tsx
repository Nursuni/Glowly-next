import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';

import { Member } from '../../types/member/member';
import { SellersInquiry } from '../../types/member/member.input';
import TopSellerCard from './TopSellerCard';

interface TopSellersProps {
	initialInput: SellersInquiry;
}

const TopSellers = (props: TopSellersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topSellers, setTopSellers] = useState<Member[]>([]);

	/** HANDLERS **/

	const redirectToSellersPage = () => {
		router.push('/seller');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-sellers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Sellers</span>
					</Stack>

					<Stack className={'wrapper'}>
						<Swiper
							className={'top-sellers-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topSellers.map((seller: Member) => (
								<SwiperSlide className={'top-sellers-slide'} key={seller?._id}>
									<TopSellerCard seller={seller} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'top-sellers'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Top Sellers</span>
						<p>Our top sellers are always ready to serve you</p>
					</Box>

					<Box component={'div'} className={'right'}>
						<div className={'more-box'} onClick={redirectToSellersPage} style={{ cursor: 'pointer' }}>
							<span>See All Sellers</span>
							<img src="/img/icons/rightup.svg" alt="" />
						</div>
					</Box>
				</Stack>

				<Stack className={'wrapper'}>
					<Box component={'div'} className={'switch-btn swiper-sellers-prev'}>
						<ArrowBackIosNewIcon />
					</Box>

					<Box component={'div'} className={'card-wrapper'}>
						<Swiper
							className={'top-sellers-swiper'}
							slidesPerView={'auto'}
							spaceBetween={29}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-sellers-next',
								prevEl: '.swiper-sellers-prev',
							}}
						>
							{topSellers.map((seller: Member) => (
								<SwiperSlide className={'top-sellers-slide'} key={seller?._id}>
									<TopSellerCard seller={seller} />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>

					<Box component={'div'} className={'switch-btn swiper-sellers-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

TopSellers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopSellers;
