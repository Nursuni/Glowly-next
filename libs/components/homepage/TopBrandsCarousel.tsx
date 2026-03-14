import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopBrandCard from './TopBrandCard';
import { Member } from '@/libs/types/member/member';
import { BrandsInquiry } from '@/libs/types/member/member.input';
import { GET_BRANDS } from '@/apollo/user/query';
import { T } from '@/libs/types/common';
import { useQuery } from '@apollo/client';

interface TopBrandsProps {
	initialInput: BrandsInquiry;
}

const TopBrandsCarousel = (props: TopBrandsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topBrands, setTopBrands] = useState<Member[]>([]);

	/** APOLLO REQUEST **/
	const { loading, data, error, refetch } = useQuery(GET_BRANDS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopBrands(data?.getBrands?.list);
		},
	});

	if (device === 'mobile') {
		return (
			<Stack className={'top-brands'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Brands</span>
					</Stack>

					<Stack className={'wrapper'}>
						<Swiper
							className={'top-brands-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={24}
							modules={[Autoplay]}
						>
							{topBrands.map((brand: Member) => (
								<SwiperSlide className={'top-brands-slide'} key={brand?._id}>
									<TopBrandCard brand={brand} likeMemberHandler={undefined} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-brands'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box className={'left'}>
							<span>Top Brands</span>
							<p>Discover the most loved skincare brands</p>
						</Box>

						<Box className={'right'}>
							<div className={'more-box'}>
								<span>See All Brands</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>

					<Stack className={'wrapper'}>
						<Box className={'switch-btn swiper-brands-prev'}>
							<ArrowBackIosNewIcon />
						</Box>

						<Box className={'card-wrapper'}>
							<Swiper
								className={'top-brands-swiper'}
								slidesPerView={'auto'}
								spaceBetween={24}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-brands-next',
									prevEl: '.swiper-brands-prev',
								}}
							>
								{topBrands.map((brand: Member) => (
									<SwiperSlide className={'top-brands-slide'} key={brand?._id}>
										<TopBrandCard brand={brand} likeMemberHandler={undefined} />
									</SwiperSlide>
								))}
							</Swiper>
						</Box>

						<Box className={'switch-btn swiper-brands-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopBrandsCarousel.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopBrandsCarousel;
