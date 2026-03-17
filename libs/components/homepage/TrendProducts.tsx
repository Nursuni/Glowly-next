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

import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery, useMutation } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Direction, Message } from '../../enums/common.enum';
import { toastError, toastSuccess } from '@/libs/toast';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const { data: getProductsData, refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (getProductsData?.getProducts?.list) {
			setTrendProducts(getProductsData.getProducts.list);
		}
	}, [getProductsData]);

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch({ input: initialInput });
			await toastSuccess('success');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			toastError(errorMessage);
		}
	};

	/** MOBILE **/
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
								slidesPerView={1.3}
								centeredSlides={true}
								spaceBetween={12}
								modules={[Autoplay]}
								autoplay={{ delay: 3500, disableOnInteraction: false }}
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

	/** DESKTOP **/
	return (
		<Stack className="trend-products">
			<Stack className="container">
				{/* ── Section Header ── */}
				<Stack className="info-box">
					<Box className="left">
						<span className="section-eyebrow">★ curated for you</span>
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
							slidesPerView={4}
							spaceBetween={20}
							breakpoints={{
								// ≥ 1280px → 5 cards
								1280: { slidesPerView: 5, spaceBetween: 20 },
								// 1024–1279px → 4 cards
								1024: { slidesPerView: 4, spaceBetween: 18 },
								// 768–1023px → 3 cards
								768: { slidesPerView: 3, spaceBetween: 16 },
							}}
							modules={[Autoplay, Navigation, Pagination]}
							autoplay={{ delay: 4000, disableOnInteraction: false }}
							navigation={{
								nextEl: '.swiper-trend-next',
								prevEl: '.swiper-trend-prev',
							}}
							pagination={{
								el: '.swiper-trend-pagination',
								clickable: true,
							}}
						>
							{trendProducts.map((product: Product) => (
								<SwiperSlide key={product._id} className="trend-product-slide">
									<TrendProductCard product={product} likeProductHandler={likeProductHandler} />
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
		limit: 10,
		sort: 'productLikes',
		direction: Direction.DESC,
		search: {},
	},
};

export default TrendProducts;
