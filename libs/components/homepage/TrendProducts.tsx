import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import TrendProductCard from './TrendProductCard';
import { ProductCard } from '../mypage/ProductCard';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	// TODO: fetch products using initialInput via Apollo/GraphQL
	// useEffect(() => { ... fetch logic ... }, [initialInput]);

	if (!trendProducts) return null;

	if (device === 'mobile') {
		return (
			<Stack className="trend-products">
				<Stack className="container">
					<Stack className="info-box">
						<span>Our Best Selling Products</span>
					</Stack>
					<Stack className="card-box">
						{trendProducts.length === 0 ? (
							<Box className="empty-list">No Trending Products</Box>
						) : (
							<Swiper
								className="trend-product-swiper"
								slidesPerView="auto"
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendProducts.map((product: Product) => (
									<SwiperSlide key={product._id} className="trend-product-slide">
										<ProductCard product={product} />
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="trend-products">
			<Stack className="container">
				{/* ── Section Header ── */}
				<Stack className="info-box">
					<Box className="left">
						{/* Eyebrow label */}
						<span className="section-eyebrow">★ curated for you</span>
						{/* Main heading */}
						<h2 className="section-title">
							Trending <em>Now</em>
						</h2>
						<p className="section-sub">Ranked by community love</p>
					</Box>

					<Box className="right">
						<Box className="pagination-box">
							<button className="nav-btn swiper-trend-prev" aria-label="Previous">
								<WestIcon />
							</button>
							<div className="swiper-trend-pagination" />
							<button className="nav-btn swiper-trend-next" aria-label="Next">
								<EastIcon />
							</button>
						</Box>
					</Box>
				</Stack>

				{/* ── Swiper ── */}
				<Stack className="card-box">
					{trendProducts.length === 0 ? (
						<Box className="empty-list">
							<span className="empty-icon">✦</span>
							<p>No Trending Products Yet</p>
						</Box>
					) : (
						<Swiper
							className="trend-product-swiper"
							slidesPerView="auto"
							spaceBetween={20}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-trend-next',
								prevEl: '.swiper-trend-prev',
							}}
							pagination={{
								el: '.swiper-trend-pagination',
								clickable: true,
							}}
							autoplay={{
								delay: 4000,
								disableOnInteraction: false,
								pauseOnMouseEnter: true,
							}}
						>
							{trendProducts.map((product: Product) => (
								<SwiperSlide key={product._id} className="trend-product-slide">
									<TrendProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

TrendProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProducts;
