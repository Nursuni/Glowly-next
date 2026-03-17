import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { ProductsInquiry } from '../../types/product/product.input';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { Product } from '../../types/product/product';
import { ProductCard } from '../mypage/ProductCard';

interface MemberProductsProps {
	initialInput: ProductsInquiry;
	likeMemberHandler: (id: string, refetch?: any, query?: any) => void;
}

const MemberProducts: NextPage<MemberProductsProps> = ({ initialInput, likeMemberHandler }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({ ...initialInput });
	const [brandProducts, setBrandProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUEST **/
	const { refetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setBrandProducts(data?.getProducts?.list ?? []);
			setTotal(data?.getProducts?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) {
			setSearchFilter({
				...initialInput,
				search: { ...initialInput.search, memberId: memberId as string },
			});
		}
	}, [memberId]);

	useEffect(() => {
		if (refetch) refetch({ input: searchFilter });
	}, [searchFilter, refetch]);

	/** HANDLERS **/
	const paginationHandler = (_: T, value: number) => {
		setSearchFilter((prev) => ({ ...prev, page: value }));
	};

	if (device === 'mobile') return <div>Glowly MOBILE</div>;

	return (
		<div id="member-products-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Products</Typography>
				</Stack>
			</Stack>

			<Stack className="products-list-box">
				<Stack className="list-box">
					{brandProducts.length > 0 && (
						<Stack className="listing-title-box">
							<Typography className="title-text">Product title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
						</Stack>
					)}

					{brandProducts.length === 0 && (
						<div className="no-data">
							<img src="/img/icons/icoAlert.svg" alt="no products" />
							<p>You haven't added any beauty products yet.</p>
						</div>
					)}

					{brandProducts.map((product: Product) => (
						<ProductCard product={product} memberPage key={product?._id} />
					))}

					{brandProducts.length > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(total / searchFilter.limit)}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>{total} products available</Typography>
							</Stack>
						</Stack>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

MemberProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',

			productTypeList: [],
		},
	},
};

export default MemberProducts;
