import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';

import { T } from '../../types/common';
import { GET_VISITED_PRODUCTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Product } from '../../types/product/product';
import { ProductCard } from './ProductCard';

const RecentlyVisitedProducts: NextPage = () => {
	const device = useDeviceDetect();

	const [recentlyVisitedProducts, setRecentlyVisitedProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisitedProducts, setSearchVisitedProducts] = useState<T>({
		page: 1,
		limit: 6,
	});

	const { data: getVisitedProductsData } = useQuery(GET_VISITED_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisitedProducts,
		},
	});

	useEffect(() => {
		if (getVisitedProductsData) {
			// ✅ FIX: field is 'getVisited' not 'getVisitedProducts'
			setRecentlyVisitedProducts(getVisitedProductsData?.getVisited?.list || []);
			setTotal(getVisitedProductsData?.getVisited?.metaCounter?.[0]?.total || 0);
		}
	}, [getVisitedProductsData]);

	const paginationHandler = (e: T, value: number) => {
		setSearchVisitedProducts({ ...searchVisitedProducts, page: value });
	};

	if (device === 'mobile') return <div>Recently Viewed MOBILE</div>;

	return (
		<div id="my-favorites-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Recently Viewed</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>
			</Stack>

			<Stack className="favorites-list-box">
				{recentlyVisitedProducts?.length ? (
					recentlyVisitedProducts.map((product: Product) => <ProductCard key={product._id} product={product} />)
				) : (
					<div className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No recently viewed products found!</p>
					</div>
				)}
			</Stack>

			{recentlyVisitedProducts?.length ? (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchVisitedProducts.limit)}
							page={searchVisitedProducts.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>
							Total {total} recently viewed product{total > 1 ? 's' : ''}
						</Typography>
					</Stack>
				</Stack>
			) : null}
		</div>
	);
};

export default RecentlyVisitedProducts;
