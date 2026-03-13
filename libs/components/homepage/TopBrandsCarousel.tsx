import React from 'react';
import { Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import TopBrandCard from './TopBrandCard';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';

const dummyBrands = [
	{ _id: 'b1', memberNick: 'La Mer', memberImage: null, memberProducts: 24, memberViews: 3200, memberLikes: 410 },
	{ _id: 'b2', memberNick: 'Sulwhasoo', memberImage: null, memberProducts: 38, memberViews: 2850, memberLikes: 376 },
	{ _id: 'b3', memberNick: 'Laneige', memberImage: null, memberProducts: 31, memberViews: 2100, memberLikes: 298 },
	{ _id: 'b4', memberNick: 'Innisfree', memberImage: null, memberProducts: 56, memberViews: 1980, memberLikes: 265 },
	{ _id: 'b5', memberNick: 'Aestura', memberImage: null, memberProducts: 19, memberViews: 1540, memberLikes: 183 },
	{ _id: 'b6', memberNick: 'Huxley', memberImage: null, memberProducts: 22, memberViews: 1320, memberLikes: 154 },
	{ _id: 'b7', memberNick: 'Missha', memberImage: null, memberProducts: 44, memberViews: 2430, memberLikes: 319 },
	{ _id: 'b8', memberNick: 'Cosrx', memberImage: null, memberProducts: 33, memberViews: 2760, memberLikes: 402 },
];

const TopBrandsCarousel = () => {
	return (
		<Stack className={'top-brands'}>
			<Stack className={'container'}>
				{/* ── Header ── */}
				<Stack className={'info-box'}>
					<div className={'left'}>
						<span>Brands We Love</span>
					</div>
					<div className={'right'}>
						<div className={'pagination-box'}>
							<div className={'switch-btn swiper-brands-prev'}>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="15 18 9 12 15 6" />
								</svg>
							</div>
							<div className={'switch-btn swiper-brands-next'}>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</div>
						</div>
					</div>
				</Stack>

				{/* ── Carousel ── */}
				<div className={'wrapper'}>
					<div className={'card-wrapper'}>
						<Swiper
							className={'top-brands-swiper'}
							slidesPerView={'auto'}
							spaceBetween={24}
							loop={true}
							modules={[Autoplay, Navigation]}
							autoplay={{ delay: 3500, disableOnInteraction: false }}
							navigation={{
								nextEl: '.swiper-brands-next',
								prevEl: '.swiper-brands-prev',
							}}
						>
							{dummyBrands.map((brand) => (
								<SwiperSlide key={brand._id} className={'top-brands-slide'}>
									<TopBrandCard brand={brand as any} />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</Stack>
		</Stack>
	);
};

export default TopBrandsCarousel;
