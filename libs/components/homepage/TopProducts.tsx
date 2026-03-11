import React, { useState, useMemo } from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './TopProductCard';
import { dummyProducts } from '@/libs/dummyProducts';
import { SkinType } from '@/libs/enums/product.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// ─── Filter config ─────────────────────────────────────────
type FilterValue = SkinType | 'ALL';

const SKIN_FILTERS: { label: string; value: FilterValue }[] = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Normal', value: SkinType.NORMAL },
	{ label: 'Dry', value: SkinType.DRY },
	{ label: 'Oily', value: SkinType.OILY },
	{ label: 'Combination', value: SkinType.COMBINATION },
	{ label: 'Sensitive', value: SkinType.SENSITIVE },
];

const TopProducts = () => {
	const device = useDeviceDetect();
	const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');

	// Filter dummy products by selected skin type
	const filteredProducts = useMemo(() => {
		if (activeFilter === 'ALL') return dummyProducts;
		return dummyProducts.filter((p) => Array.isArray(p.skinType) && p.skinType.includes(activeFilter as SkinType));
	}, [activeFilter]);

	// ─── Shared header ─────────────────────────────────────
	const renderHeader = () => (
		<Stack className="info-box">
			<Box component="div" className="header-center">
				<span className="eyebrow">
					<span className="icon-wrapper">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
							<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
						</svg>
					</span>
					Most Popular
				</span>

				<p className="headline">Our Skincare Solutions</p>

				<Box component="div" className="filter-box">
					<span className="filter-label">I'd like to browse</span>
					<Box component="div" className="filter-pills">
						{SKIN_FILTERS.map(({ label, value }) => (
							<button
								key={value}
								className={`filter-pill${activeFilter === value ? ' filter-pill--active' : ''}`}
								onClick={() => setActiveFilter(value)}
							>
								{label}
							</button>
						))}
					</Box>
				</Box>
			</Box>
		</Stack>
	);

	// ─── Shared swiper ─────────────────────────────────────
	const renderCards = (spaceBetween = 16) => {
		if (filteredProducts.length === 0) {
			return <Box className="top-products-empty">No products found for this skin type.</Box>;
		}

		return (
			<Swiper
				className="top-product-swiper"
				slidesPerView="auto"
				spaceBetween={spaceBetween}
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
					<SwiperSlide key={product._id} className="top-product-slide">
						<TopProductCard product={product} />
					</SwiperSlide>
				))}
			</Swiper>
		);
	};

	// ─── Mobile ────────────────────────────────────────────
	if (device === 'mobile') {
		return (
			<Stack className="top-products">
				<Stack className="container">
					{renderHeader()}
					<Stack className="card-box">{renderCards(12)}</Stack>
				</Stack>
			</Stack>
		);
	}

	// ─── Desktop ───────────────────────────────────────────
	return (
		<Stack className="top-products">
			<Stack className="container">
				{renderHeader()}
				<Stack className="card-box">{renderCards(16)}</Stack>
			</Stack>
		</Stack>
	);
};

export default TopProducts;
