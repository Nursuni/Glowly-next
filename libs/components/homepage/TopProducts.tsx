import React, { useState, useMemo } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './TopProductCard';
import { dummyProducts } from '@/libs/dummyProducts';
import { SkinType } from '@/libs/enums/product.enum';

const SKIN_TYPE_LABELS: Record<SkinType, string> = {
	[SkinType.NORMAL]: 'Normal',
	[SkinType.DRY]: 'Dry',
	[SkinType.OILY]: 'Oily',
	[SkinType.COMBINATION]: 'Combination',
	[SkinType.SENSITIVE]: 'Sensitive',
};

const TopProducts = () => {
	const device = useDeviceDetect();
	const [activeFilter, setActiveFilter] = useState<SkinType>(SkinType.NORMAL);

	const filteredProducts = useMemo(() => {
		const filtered = dummyProducts.filter((p) => Array.isArray(p.skinType) && p.skinType.includes(activeFilter));
		return filtered.length > 0 ? filtered : dummyProducts;
	}, [activeFilter]);

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
							{filteredProducts.map((product) => (
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
				<Stack className={'info-box'}>
					<Box component="div" className="header-center">
						<span className="eyebrow">
							<span className="icon-wrapper">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
									<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
								</svg>
							</span>
							Most Popular Product
						</span>

						<p className="headline">Our Skincare Solutions</p>

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
				</Stack>

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
						{filteredProducts.map((product) => (
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
