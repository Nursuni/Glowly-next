import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Button, Menu, MenuItem, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { Product } from '../../libs/types/product/product';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { toastError, toastSuccess } from '@/libs/toast';
import { SORT_OPTIONS } from '../brand';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import GridViewIcon from '@mui/icons-material/GridView';
import ProductCard from '@/libs/components/product/CatalogProductCard';
import { T } from '@/libs/types/common';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

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

const cleanSearchFilter = (input: ProductsInquiry): ProductsInquiry => {
	const safeSorts = ['createdAt', 'updatedAt', 'productLikes', 'productViews', 'productRank', 'productPrice'];

	return {
		...input,
		sort: safeSorts.includes(input.sort) ? input.sort : 'createdAt',
		search: {
			text: input.search?.text ?? '',
			pricesRange: input.search?.pricesRange ?? { start: 0, end: 200000 },
			skinType: input.search?.skinType ?? [],
			productTypeList: input.search?.productTypeList ?? [],
			ageRange: input.search?.ageRange ?? [],
			productTarget: input.search?.productTarget,
		},
	};
};

const ProductList: NextPage<{ initialInput: ProductsInquiry }> = ({ initialInput }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(() => {
		try {
			if (router?.query?.input) {
				const parsed = JSON.parse(router.query.input as string);
				const safeSorts = ['createdAt', 'updatedAt', 'productLikes', 'productViews', 'productRank', 'productPrice'];
				if (!safeSorts.includes(parsed.sort)) parsed.sort = 'createdAt';
				return parsed;
			}
		} catch (e) {
			console.error('❌ Failed to parse router input:', e);
		}
		return initialInput;
	});

	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [viewMode, setViewMode] = useState<'small' | 'medium' | 'large'>('small');
	const [filterSortName, setFilterSortName] = useState('New');

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
			try {
				const inputObj = JSON.parse(router.query.input as string);
				const safeSorts = ['createdAt', 'updatedAt', 'productLikes', 'productViews', 'productRank', 'productPrice'];
				if (!safeSorts.includes(inputObj.sort)) inputObj.sort = 'createdAt';
				setSearchFilter(inputObj);
				setCurrentPage(inputObj.page ?? 1);
			} catch (e) {
				console.error('❌ Router parse error:', e);
			}
		}
	}, [router.query.input]);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const sortingOpen = Boolean(anchorEl);

	const sortingClickHandler = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
	const sortingCloseHandler = () => setAnchorEl(null);

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		const selected = SORT_OPTIONS.find((opt) => opt.id === e.currentTarget.id);
		if (!selected) return;
		const updatedFilter = { ...searchFilter, sort: selected.sort, direction: selected.direction, page: 1 };
		setSearchFilter(updatedFilter);
		setFilterSortName(selected.label);
		setCurrentPage(1);
		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
		setAnchorEl(null);
	};

	useEffect(() => {
		refetch({ input: cleanSearchFilter(searchFilter) });
	}, [searchFilter]);

	const handlePaginationChange = async (_: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };
		setSearchFilter(updatedFilter);
		setCurrentPage(value);
		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			await refetch({ input: cleanSearchFilter(searchFilter) });
			toastSuccess('Product liked!');
		} catch (err) {
			toastError(err instanceof Error ? err.message : String(err));
		}
	};

	if (device === 'mobile') return <div>Mobile view</div>;

	return (
		<div id="product-list-page" data-view={viewMode}>
			{/* ── Hero ── */}
			<div className="hero-box">
				<div className="product-main-info">
					<span className="product-eyebrow">Our catalog</span>
					<h1 className="product-heading">
						Discover our <em>products</em>
					</h1>
					<p className="product-sub">Browse our latest cosmetics and beauty products</p>
				</div>
			</div>

			{/* ── Main content: filter + products ── */}
			<div className="container">
				<div className="product-page">
					{/* Filter sidebar */}
					<div className="filter-config">
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</div>

					{/* Right side: toolbar + grid */}
					<div className="product-right">
						{/* ── Toolbar ── */}
						<div className="toolbar-box">
							<div className="toolbar-left">
								<button
									className={`sort-btn ${viewMode === 'small' ? 'active' : ''}`}
									onClick={() => setViewMode('small')}
									title="3 columns"
								>
									<ViewModuleIcon />
								</button>
								<button
									className={`sort-btn ${viewMode === 'medium' ? 'active' : ''}`}
									onClick={() => setViewMode('medium')}
									title="2 columns"
								>
									<ViewQuiltIcon />
								</button>
								<button
									className={`sort-btn ${viewMode === 'large' ? 'active' : ''}`}
									onClick={() => setViewMode('large')}
									title="1 column"
								>
									<GridViewIcon />
								</button>
							</div>
							<div className="toolbar-right">
								<span className="sort-label">Sort by</span>
								<Button onClick={sortingClickHandler} disableRipple className="sort-btn">
									<FavoriteBorderRoundedIcon />
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} disableScrollLock>
									{SORT_OPTIONS.map((item) => (
										<MenuItem
											key={item.id}
											id={item.id}
											onClick={sortingHandler}
											sx={{
												fontSize: '13px',
												color: filterSortName === item.label ? '#d4789a' : '#555',
												fontWeight: filterSortName === item.label ? 600 : 400,
											}}
										>
											{item.label}
										</MenuItem>
									))}
								</Menu>
							</div>
						</div>

						{/*
						 * FIX: .no-data is now a sibling of .list-config, not a child.
						 * When it was inside the grid, align-content:start collapsed its
						 * row to content height so centering never worked regardless of
						 * any CSS tricks. Now it's a plain block element with full control
						 * over its own height and centering.
						 */}
						{products?.length === 0 ? (
							<div className="no-data">
								<span className="no-data-icon">✦</span>
								<p>No products available for now</p>
							</div>
						) : (
							<div className="list-config">
								{products.map((product) => (
									<ProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
								))}
								{total > 0 && (
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
							</div>
						)}
					</div>
				</div>
			</div>
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
			pricesRange: { start: 0, end: 200000 },
			productTypeList: [],
			ageRange: [],
			productTarget: undefined,
		},
	},
};

export default withLayoutBasic(ProductList);
