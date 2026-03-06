import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';

import { Member } from '../../types/member/member';
import { BrandsInquiry } from '../../types/member/member.input';
import TopBrandCard from './TopBrandCard';

interface TopBrandsProps {
	initialInput: BrandsInquiry;
}

const TopBrands = (props: TopBrandsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topBrands, setTopBrands] = useState<Member[]>([]);

	/** HANDLERS **/

	const redirectToBrandsPage = () => {
		router.push('/brand');
	};

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
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topBrands.map((brand: Member) => (
								<SwiperSlide className={'top-brands-slide'} key={brand?._id}>
									<TopBrandCard brand={brand} />
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
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Top Brands</span>
						<p>Our top brands are always ready to serve you</p>
					</Box>

					<Box component={'div'} className={'right'}>
						<div className={'more-box'} onClick={redirectToBrandsPage} style={{ cursor: 'pointer' }}>
							<span>See All Brands</span>
							<img src="/img/icons/rightup.svg" alt="" />
						</div>
					</Box>
				</Stack>

				<Stack className={'wrapper'}>
					<Box component={'div'} className={'switch-btn swiper-brands-prev'}>
						<ArrowBackIosNewIcon />
					</Box>

					<Box component={'div'} className={'card-wrapper'}>
						<Swiper
							className={'top-brands-swiper'}
							slidesPerView={'auto'}
							spaceBetween={29}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-brands-next',
								prevEl: '.swiper-brands-prev',
							}}
						>
							{topBrands.map((brand: Member) => (
								<SwiperSlide className={'top-brands-slide'} key={brand?._id}>
									<TopBrandCard brand={brand} />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>

					<Box component={'div'} className={'switch-btn swiper-brands-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

TopBrands.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopBrands;
