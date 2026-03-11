import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { Product } from '../../libs/types/product/product';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Direction } from '../../libs/enums/common.enum';
import { ProductCard } from '../../libs/components/mypage/ProductCard';
import SubscribeSection from '../../libs/components/common/SubscribeSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Toolbar from '../../libs/components/common/Toolbar';
import { SORT_OPTIONS } from '@/libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput }: any) => {
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

	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page ?? 1);
		}
	}, [router.query.input]);

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };
		setSearchFilter(updatedFilter);
		setCurrentPage(value);

		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

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

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		let updatedFilter = { ...searchFilter };

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

			{/* TOOLBAR BOX */}
			<div className="toolbar-box">
				<div className="container">
					<div className="toolbar">
						<Toolbar
							searchText={searchText}
							setSearchText={setSearchText}
							onSearchSubmit={handleSearchSubmit}
							onSearchKeyDown={handleSearchKeyDown}
							sortingClickHandler={sortingClickHandler}
							sortingHandler={sortingHandler}
							sortingCloseHandler={sortingCloseHandler}
							anchorEl={anchorEl}
							sortingOpen={sortingOpen}
							filterSortName={filterSortName}
							sortOptions={SORT_OPTIONS}
						/>
					</div>
				</div>
			</div>

			{/* CONTENT AREA */}
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
							products.map((product: Product) => <ProductCard product={product} key={product._id} />)
						)}
					</div>
				</div>
			</div>

			{/* PAGINATION */}
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
		search: {},
	},
};

export default withLayoutBasic(ProductList);
