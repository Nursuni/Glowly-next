import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import TopBrandCard from './TopBrandCard';
import { Member } from '@/libs/types/member/member';
import { BrandsInquiry } from '@/libs/types/member/member.input';
import { GET_BRANDS } from '@/apollo/user/query';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Direction } from '@/libs/enums/common.enum';
import Link from 'next/link';
import { userVar } from '@/apollo/store';

interface TopBrandsProps {
	initialInput: BrandsInquiry;
}

const TopBrandsCarousel = ({ initialInput }: TopBrandsProps) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const { data } = useQuery(GET_BRANDS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const topBrands: Member[] = data?.getBrands?.list ?? [];

	if (device === 'mobile') {
		return (
			<Stack className={'top-brands'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box className={'left'}>
							<span>Top Brands</span>
							<p>Discover the most loved skincare brands</p>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-brands-swiper'}
							slidesPerView={'auto'}
							centeredSlides
							spaceBetween={24}
							modules={[Autoplay]}
							autoplay={{ delay: 2500 }}
						>
							{topBrands.map((brand) => (
								<SwiperSlide className={'top-brands-slide'} key={brand._id}>
									<TopBrandCard brand={brand} likeMemberHandler={() => {}} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'top-brands'}>
			<Stack className={'container'}>
				{/* Header */}
				<Stack className={'info-box'}>
					<Box className={'left'}>
						<span className="section-eyebrow">★ featured</span>
						<p className="section-title">
							Top <em>Brands</em>
						</p>
						<span className="section-sub">Discover the most loved skincare brands</span>
					</Box>

					<Box className={'right'}>
						<Link href="/brand" className="more-box">
							<span>See All Brands</span>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path
									d="M2 12L12 2M12 2H5M12 2V9"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</Link>
					</Box>
				</Stack>

				{/* Swiper */}
				{topBrands.length === 0 ? (
					<Box className="empty-list">
						<div className="empty-icon">✦</div>
						<p>No brands yet</p>
					</Box>
				) : (
					<Stack className={'wrapper'}>
						<Box className={'switch-btn swiper-brands-prev'}>
							<ArrowBackIosNewIcon />
						</Box>

						<Box className={'card-wrapper'}>
							<Swiper
								className={'top-brands-swiper'}
								slidesPerView={'auto'}
								spaceBetween={24}
								modules={[Autoplay, Navigation]}
								autoplay={{ delay: 3000, disableOnInteraction: false }}
								navigation={{
									nextEl: '.swiper-brands-next',
									prevEl: '.swiper-brands-prev',
								}}
							>
								{topBrands.map((brand) => (
									<SwiperSlide className={'top-brands-slide'} key={brand._id}>
										<TopBrandCard brand={brand} likeMemberHandler={() => {}} />
									</SwiperSlide>
								))}
							</Swiper>
						</Box>

						<Box className={'switch-btn swiper-brands-next'}>
							<ArrowForwardIosIcon />
						</Box>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

TopBrandsCarousel.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: Direction.DESC,
		search: {},
	},
};

export default TopBrandsCarousel;
