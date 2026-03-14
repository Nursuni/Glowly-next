import React, { useState, useMemo, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './TopProductCard';

import { SkinType } from '@/libs/enums/product.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { Product } from '@/libs/types/product/product';
import { ProductsInquiry } from '@/libs/types/product/product.input';
import { useMutation } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';

import { Direction, Message } from '../../enums/common.enum';
import { toastDismiss, toastError, toastSuccess } from '@/libs/toast';

// ─── Filter config ─────────────────────────────────────────
type FilterValue = SkinType | 'ALL';
interface TopProductsProps {
	initialInput: ProductsInquiry;
}

const SKIN_FILTERS: { label: string; value: FilterValue }[] = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Normal', value: SkinType.NORMAL },
	{ label: 'Dry', value: SkinType.DRY },
	{ label: 'Oily', value: SkinType.OILY },
	{ label: 'Combination', value: SkinType.COMBINATION },
	{ label: 'Sensitive', value: SkinType.SENSITIVE },
];

const TopProducts = (props: TopProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
	const [topProducts, setTopProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { data: getProductsData, refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	/** Update local state when API data changes **/
	useEffect(() => {
		if (getProductsData?.getProducts?.list) {
			setTopProducts(getProductsData.getProducts.list);
		}
	}, [getProductsData]);

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likeTargetProduct
			await likeTargetProduct({
				variables: { input: id },
			});
			await getProductsRefetch({ input: initialInput });
			//execute getsRefetch
			await toastSuccess('success');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.log('errors, likeProductHandler:', errorMessage);
			toastError(errorMessage);
		}
	};

	// Filter dummy products by selected skin type
	const filteredProducts = useMemo(() => {
		if (activeFilter === 'ALL') return topProducts;
		return topProducts.filter((p) => Array.isArray(p.skinType) && p.skinType.includes(activeFilter as SkinType));
	}, [activeFilter, topProducts]);

	// ─── Shared header ─────────────────────────────────────
	const renderHeader = () => (
		<Stack className="info-box">
			<Box component="div" className="container">
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
						<TopProductCard product={product} likeProductHandler={likeProductHandler} />
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
