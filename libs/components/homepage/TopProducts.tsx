import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './TopProductCard';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';

interface TopProductsProps {
	initialInput: ProductsInquiry;
}

const TopProducts = (props: TopProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topProducts, setTopProducts] = useState<Product[]>([]);

	if (device === 'mobile') {
		return (
			<Stack className={'top-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>In the spotlight</span>
						<span>Beauty favourites</span>
					</Stack>

					<Stack className={'card-box'}>
						<Swiper
							className={'top-product-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topProducts.map((product: Product) => (
								<SwiperSlide className={'top-product-slide'} key={product?._id}>
									<TopProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'top-products'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Top Products</span>
						<p>Check out our Top Products</p>
					</Box>

					<Box component={'div'} className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-top-prev'} />
							<div className={'swiper-top-pagination'}></div>
							<EastIcon className={'swiper-top-next'} />
						</div>
					</Box>
				</Stack>

				<Stack className={'card-box'}>
					<Swiper
						className={'top-product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={15}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-top-next',
							prevEl: '.swiper-top-prev',
						}}
						pagination={{
							el: '.swiper-top-pagination',
						}}
					>
						{topProducts.map((product: Product) => (
							<SwiperSlide className={'top-product-slide'} key={product?._id}>
								<TopProductCard product={product} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		</Stack>
	);
};

TopProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProducts;
