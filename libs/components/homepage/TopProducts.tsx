import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './TopProductCard';
import { dummyProducts } from '@/libs/dummyProducts';

export enum SkinType {
	NORMAL = 'NORMAL',
	DRY = 'DRY',
	OILY = 'OILY',
	COMBINATION = 'COMBINATION',
	SENSITIVE = 'SENSITIVE',
}

const SKIN_TYPE_LABELS: Record<SkinType, string> = {
	[SkinType.NORMAL]: 'Normal',
	[SkinType.DRY]: 'Dry',
	[SkinType.OILY]: 'Oily',
	[SkinType.COMBINATION]: 'Combination',
	[SkinType.SENSITIVE]: 'Sensitive',
};

const SORT_OPTIONS = ['Relevant', 'Newest', 'Price: Low', 'Price: High'];

const TopProducts = () => {
	const device = useDeviceDetect();
	const [activeFilter, setActiveFilter] = useState<SkinType>(SkinType.NORMAL);
	const [sortValue, setSortValue] = useState<string>('Relevant');

	/** ─── Mobile ─────────────────────────────── */
	if (device === 'mobile') {
		return (
			<Stack className={'top-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span className={'eyebrow'}>In the spotlight</span>
						<span className={'headline'}>Beauty favourites</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-product-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{dummyProducts.map((product) => (
								<SwiperSlide key={product._id} className={'top-product-slide'}>
									<TopProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	/** ─── Desktop ────────────────────────────── */
	return (
		<Stack className={'top-products'}>
			<Stack className={'container'}>
				{/* ── Section header ── */}
				<Stack className={'info-box'}>
					{/* Left: title */}
					<Box component="div" className="header-center">
						{/* Most Popular Product with icon and gradient */}
						<span className="eyebrow">
							<span className="icon-wrapper">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
									<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
								</svg>
							</span>
							Most Popular Product
						</span>

						{/* Headline */}
						<p className="headline">Our Skincare Solutions</p>

						{/* Filters */}
						<Box component="div" className="filter-box">
							<span className="filter-label">I'd like to browse for</span>
							<Box component="div" className="filter-pills">
								{Object.values(SkinType).map((type) => (
									<button
										key={type}
										className={`filter-pill${activeFilter === type ? ' filter-pill--active' : ''}`}
										onClick={() => setActiveFilter(type)}
									>
										{SKIN_TYPE_LABELS[type]}
									</button>
								))}
							</Box>
						</Box>
					</Box>

					{/* Center: skin-type filter pills */}
				</Stack>

				{/* ── Card swiper ── */}
				<Stack className={'card-box'}>
					<Swiper
						className={'top-product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={16}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-top-next',
							prevEl: '.swiper-top-prev',
						}}
						pagination={{
							el: '.swiper-top-pagination',
							clickable: true,
						}}
					>
						{dummyProducts.map((product) => (
							<SwiperSlide key={product._id} className={'top-product-slide'}>
								<TopProductCard product={product} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TopProducts;
