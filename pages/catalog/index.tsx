import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { Product } from '../../libs/types/product/product';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Direction, Message } from '../../libs/enums/common.enum';

import SubscribeSection from '../../libs/components/common/SubscribeSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { toastError, toastSuccess } from '@/libs/toast';
import { SORT_OPTIONS } from '../brand';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import GridViewIcon from '@mui/icons-material/GridView';
import ProductCard from '@/libs/components/product/CatalogProductCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface GetProductsData {
	getProducts: {
		list: Product[];
		metaCounter: { total: number }[];
	};
}

/* CLEAN GRAPHQL INPUT */
const cleanSearchFilter = (input: ProductsInquiry): ProductsInquiry => {
	return {
		...input,
		search: {
			text: input.search?.text ?? '',
			pricesRange: input.search?.pricesRange ?? { start: 0, end: 500 },
			skinType: input.search?.skinType ?? [],
			productTypeList: input.search?.productTypeList ?? [],
		},
	};
};

const ProductList: NextPage<{ initialInput: ProductsInquiry }> = ({ initialInput }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router.query.input as string) : initialInput,
	);

	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [searchText, setSearchText] = useState('');
	const [viewMode, setViewMode] = useState<'small' | 'medium' | 'large'>('small');

	/* APOLLO */
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { data, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: cleanSearchFilter(searchFilter) },
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (data) {
			setProducts(data.getProducts.list ?? []);
			setTotal(data.getProducts.metaCounter?.[0]?.total ?? 0);
		}
	}, [data]);

	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page ?? 1);
		}
	}, [router.query.input]);

	useEffect(() => {
		refetch({ input: cleanSearchFilter(searchFilter) });
	}, [searchFilter]);

	/* PAGINATION */
	const handlePaginationChange = async (_: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };

		setSearchFilter(updatedFilter);
		setCurrentPage(value);

		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

	/* SEARCH */
	const handleSearchSubmit = async () => {
		const updatedFilter = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		};

		setSearchFilter(updatedFilter);
		setCurrentPage(1);

		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSearchSubmit();
	};

	/* SORTING */
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		const updatedFilter = { ...searchFilter };

		switch (e.currentTarget.id) {
			case 'new':
				updatedFilter.sort = 'createdAt';
				updatedFilter.direction = Direction.DESC;
				setFilterSortName('New');
				break;

			case 'lowest':
				updatedFilter.sort = 'productPrice';
				updatedFilter.direction = Direction.ASC;
				setFilterSortName('Lowest Price');
				break;

			case 'highest':
				updatedFilter.sort = 'productPrice';
				updatedFilter.direction = Direction.DESC;
				setFilterSortName('Highest Price');
				break;
		}

		updatedFilter.page = 1;

		setSearchFilter(updatedFilter);
		setCurrentPage(1);

		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});

		sortingCloseHandler();
	};

	/* LIKE */
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({ variables: { input: id } });

			await refetch({ input: cleanSearchFilter(searchFilter) });

			toastSuccess('Product liked!');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			toastError(errorMessage);
		}
	};

	if (device === 'mobile') return <div>Mobile view</div>;

	return (
		<div id="product-list-page">
			<div className="hero-box">
				<div className="product-main-info">
					<span className="product-eyebrow">Our catalog</span>
					<h1 className="product-heading">
						Discover our <em>products</em>
					</h1>
					<p className="product-sub">Browse our latest cosmetics and beauty products</p>
				</div>
			</div>

			<div className="toolbar-box">
				<div className="toolbar-container">
					<div className="toolbar-left">
						{/* View Mode Buttons */}
						<button className={`sort-btn ${viewMode === 'small' ? 'active' : ''}`} onClick={() => setViewMode('small')}>
							<ViewModuleIcon />
						</button>
						<button
							className={`sort-btn ${viewMode === 'medium' ? 'active' : ''}`}
							onClick={() => setViewMode('medium')}
						>
							<ViewQuiltIcon />
						</button>
						<button className={`sort-btn ${viewMode === 'large' ? 'active' : ''}`} onClick={() => setViewMode('large')}>
							<GridViewIcon />
						</button>
					</div>

					<div className="toolbar-right">
						{/* Sort Dropdown */}
						<select
							value={filterSortName}
							onChange={(e) => {
								const selected = SORT_OPTIONS.find((opt) => opt.label === e.target.value);
								if (!selected) return;
								const updatedFilter = {
									...searchFilter,
									sort: selected.sort,
									direction: selected.direction,
									page: 1,
								};
								setSearchFilter(updatedFilter);
								setFilterSortName(selected.label);
								setCurrentPage(1);
								router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
									scroll: false,
								});
							}}
							className="sort-select"
						>
							{SORT_OPTIONS.map((opt) => (
								<option key={opt.id} value={opt.label}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="product-page">
					<div className="filter-config">
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</div>

					<div className="list-config">
						{products?.length === 0 ? (
							<div className="no-data">
								<span className="no-data-icon">✦</span>
								<p>No products available for now</p>
							</div>
						) : (
							products.map((product: Product) => (
								<ProductCard product={product} key={product._id} likeProductHandler={likeProductHandler} />
							))
						)}
					</div>
				</div>
			</div>

			{products.length > 0 && (
				<div className="pagination-box">
					<Pagination
						page={currentPage}
						count={Math.ceil(total / (searchFilter.limit ?? 9))}
						onChange={handlePaginationChange}
						shape="circular"
						color="primary"
					/>
				</div>
			)}

			<SubscribeSection />
		</div>
	);
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			text: '',
			skinType: [],

			pricesRange: { start: 0, end: 500 },

			productTypeList: [],
		},
	},
};

export default withLayoutBasic(ProductList);
