import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';

import TrendProductCard from './TrendProducts';
import { ProductCard } from '../mypage/ProductCard';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	if (!trendProducts) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Our Best Selling Products</span>
					</Stack>

					<Stack className={'card-box'}>
						{trendProducts.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								No Trending Products
							</Box>
						) : (
							<Swiper
								className={'trend-product-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendProducts.map((product: Product) => (
									<SwiperSlide key={product._id} className={'trend-product-slide'}>
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
		<Stack className={'trend-products'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Trending Products</span>
						<p>Trending based on likes</p>
					</Box>

					<Box component={'div'} className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-trend-prev'} />
							<div className={'swiper-trend-pagination'}></div>
							<EastIcon className={'swiper-trend-next'} />
						</div>
					</Box>
				</Stack>

				<Stack className={'card-box'}>
					{trendProducts.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No Trending Products
						</Box>
					) : (
						<Swiper
							className={'trend-product-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-trend-next',
								prevEl: '.swiper-trend-prev',
							}}
							pagination={{
								el: '.swiper-trend-pagination',
							}}
						>
							{trendProducts.map((product: Product) => (
								<SwiperSlide key={product._id} className={'trend-product-slide'}>
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
