import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { Product } from '../../libs/types/product/product';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Direction } from '../../libs/enums/common.enum';
import { ProductCard } from '../../libs/components/mypage/ProductCard';
import SubscribeSection from '../../libs/components/common/SubscribeSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

	/* -------------------- URL SYNC -------------------- */
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page ?? 1);
		}
	}, [router.query.input]);

	/* -------------------- PAGINATION -------------------- */
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };

		setSearchFilter(updatedFilter);
		setCurrentPage(value);

		await router.push(
			{
				pathname: '/catalog',
				query: { input: JSON.stringify(updatedFilter) },
			},
			undefined,
			{ scroll: false },
		);
	};

	/* -------------------- SORTING -------------------- */
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
				updatedFilter.direction = Direction.DESC; // newest first
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

		await router.push(
			{
				pathname: '/catalog',
				query: { input: JSON.stringify(updatedFilter) },
			},
			undefined,
			{ scroll: false },
		);

		setSortingOpen(false);
		setAnchorEl(null);
	};

	/* -------------------- MOBILE -------------------- */
	if (device === 'mobile') {
		return (
			<div id="product-list-page-mobile">
				<div className="mobile-container">
					{/* SORT + FILTER HEADER */}
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
						<Typography variant="h6">Products</Typography>

						<Button size="small" onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>

						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
							<MenuItem onClick={sortingHandler} id="new">
								New
							</MenuItem>
							<MenuItem onClick={sortingHandler} id="lowest">
								Lowest Price
							</MenuItem>
							<MenuItem onClick={sortingHandler} id="highest">
								Highest Price
							</MenuItem>
						</Menu>
					</Stack>

					{/* FILTER SECTION */}
					<Box sx={{ px: 2, pb: 2 }}>
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Box>

					{/* PRODUCT LIST */}
					<Stack spacing={2} sx={{ px: 2 }}>
						{products?.length === 0 ? (
							<Box textAlign="center" py={5}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<Typography>No Products found!</Typography>
							</Box>
						) : (
							products.map((product: Product) => <ProductCard product={product} key={product._id} />)
						)}
					</Stack>

					{/* PAGINATION */}
					{products.length !== 0 && (
						<Stack alignItems="center" py={4}>
							<Pagination
								page={currentPage}
								count={Math.ceil(total / (searchFilter.limit ?? 9))}
								onChange={handlePaginationChange}
								shape="circular"
								size="small"
								color="primary"
							/>

							<Typography mt={2} fontSize={14}>
								Total {total} product{total > 1 ? 's' : ''}
							</Typography>
						</Stack>
					)}
				</div>
			</div>
		);
	}

	/* -------------------- DESKTOP -------------------- */
	return (
		<div id="product-list-page" style={{ position: 'relative' }}>
			<div className="container">
				{/* SORTING */}
				<Box component={'div'} className={'right'}>
					<span>Sort by</span>
					<div>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>

						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
							<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
								New
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'lowest'} disableRipple>
								Lowest Price
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'highest'} disableRipple>
								Highest Price
							</MenuItem>
						</Menu>
					</div>
				</Box>

				<Stack className={'product-page'}>
					<Stack className={'filter-config'}>
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Stack>

					<Stack className="main-config" mb={'76px'}>
						<Stack className={'list-config'}>
							{products?.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No Products found!</p>
								</div>
							) : (
								products.map((product: Product) => <ProductCard product={product} key={product._id} />)
							)}
						</Stack>

						{/* PAGINATION */}
						<Stack className="pagination-config">
							{products.length !== 0 && (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / (searchFilter.limit ?? 9))}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>

									<Stack className="total-result">
										<Typography>
											Total {total} product
											{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								</>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
			<SubscribeSection />
		</div>
	);
};

/* -------------------- DEFAULT FILTER -------------------- */
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
