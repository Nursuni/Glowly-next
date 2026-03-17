import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { Product } from '../../types/product/product';
import { BrandProductsInquiry } from '../../types/product/product.input';
import { ProductStatus } from '../../enums/product.enum';
import { toastError, toastWarning } from '../../toast';
import { ProductCard } from './ProductCard';
import { GET_BRAND_PRODUCTS } from '@/apollo/user/query';
import { T } from '@/libs/types/common';

const STATUS_TABS = [
	{ label: 'On Sale', value: ProductStatus.ACTIVE },
	{ label: 'Sold Out', value: ProductStatus.SOLD },
];

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<BrandProductsInquiry>(initialInput);
	const [brandProducts, setBrandProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);
	const { loading, refetch: getBrandProductsRefetch } = useQuery(GET_BRAND_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBrandProducts(data?.getBrandProducts?.list ?? []);
			setTotal(data?.getBrandProducts?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (_: T, value: number) => setSearchFilter((prev) => ({ ...prev, page: value }));

	const changeStatusHandler = (value: ProductStatus) =>
		setSearchFilter((prev) => ({ ...prev, page: 1, search: { productStatus: value } }));

	const deleteProductHandler = async (id: string) => {
		try {
			if (await toastWarning('Are you sure you want to delete this product?')) {
				await updateProduct({ variables: { input: { _id: id, productStatus: ProductStatus.DELETED } } });
				await getBrandProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await toastError(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await toastWarning(`Change status to ${status}?`)) {
				await updateProduct({ variables: { input: { _id: id, productStatus: status } } });
				await getBrandProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await toastError(err);
		}
	};

	if (user?.memberType !== 'BRAND') {
		router.back();
		return null;
	}
	if (device === 'mobile') return <div>GLOWLY PRODUCTS MOBILE</div>;

	const activeStatus = searchFilter.search.productStatus;
	const totalPages = Math.ceil(total / searchFilter.limit);

	return (
		<div id="my-product-page">
			{/* ── Header ── */}
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">My Products</Typography>
					<Typography className="sub-title">Manage and track your listed products</Typography>
				</Stack>
			</Stack>

			{/* ── Content ── */}
			<Stack className="product-list-box">
				{/* Tab filter */}
				<Stack className="tab-name-box">
					{STATUS_TABS.map((tab) => (
						<Typography
							key={tab.value}
							onClick={() => changeStatusHandler(tab.value)}
							className={activeStatus === tab.value ? 'active-tab-name' : 'tab-name'}
						>
							{tab.label}
						</Typography>
					))}
				</Stack>

				{/* Skeleton */}
				{loading && (
					<div className="skeleton-list">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="skeleton-row">
								<div className="skeleton-thumb" />
								<div className="skeleton-lines">
									<div className="skeleton-line w70" />
									<div className="skeleton-line w40" />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty */}
				{!loading && brandProducts.length === 0 && (
					<div className="no-data">
						<div className="no-data-icon">
							<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
								<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
								<line x1="12" y1="22.08" x2="12" y2="12" />
							</svg>
						</div>
						<p className="no-data-title">No products yet</p>
						<p className="no-data-sub">
							{activeStatus === ProductStatus.ACTIVE
								? 'Add your first product to start selling'
								: 'Sold products will appear here'}
						</p>
					</div>
				)}

				{/* Grid — same structure as favorites */}
				{!loading && brandProducts.length > 0 && (
					<div className="products-grid">
						{brandProducts.map((product: Product) => (
							<ProductCard
								key={product._id}
								product={product}
								deleteProductHandler={deleteProductHandler}
								updateProductHandler={updateProductHandler}
							/>
						))}
					</div>
				)}

				{/* Pagination */}
				{!loading && brandProducts.length > 0 && totalPages > 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={totalPages}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								{total} product{total !== 1 ? 's' : ''} available
							</Typography>
						</Stack>
					</Stack>
				)}
			</Stack>
		</div>
	);
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		search: { productStatus: ProductStatus.ACTIVE },
	},
};

export default MyProducts;
