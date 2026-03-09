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
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputBase from '@mui/material/InputBase';

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

	// Search only triggers on Enter key or clicking the icon
	const handleSearchSubmit = async () => {
		const updatedFilter = { ...searchFilter, page: 1, search: { ...searchFilter.search, text: searchText } };
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
		setSortingOpen(false);
		setAnchorEl(null);
	};

	/* ── MOBILE ── */
	if (device === 'mobile') {
		return (
			<div id="product-list-page-mobile">
				<div className="mobile-container">
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
					<Box sx={{ px: 2, pb: 2 }}>
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Box>
					<Stack spacing={2} sx={{ px: 2 }}>
						{products?.length === 0 ? (
							<Box textAlign="center" py={5}>
								<span className="no-data-icon">✦</span>
								<Typography>No products available for now</Typography>
							</Box>
						) : (
							products.map((product: Product) => <ProductCard product={product} key={product._id} />)
						)}
					</Stack>
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

	/* ── DESKTOP ── */
	return (
		<div id="product-list-page">
			<Box className="info">
				{/* HERO / TOP SECTION */}
				<Box className="product-main-info">
					<span className="product-eyebrow">Our catalog</span>
					<h1 className="product-heading">
						Discover our <em>products</em>
					</h1>

					<p className="product-sub">Browse our latest cosmetics and beauty products</p>
				</Box>
				{/* SORT + SEARCH INSIDE HERO */}
				<div className="toolbar">
					<div className="toolbar-right">
						<InputBase
							placeholder="Search"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={handleSearchKeyDown}
							className="search-input"
						/>
						<SearchRoundedIcon className="search-icon" onClick={handleSearchSubmit} />
					</div>
					<div className="toolbar-left">
						<span className="sort-label">Sort by</span>

						<Button onClick={sortingClickHandler} disableRipple className="sort-btn">
							<FavoriteBorderRoundedIcon />
						</Button>

						<Menu
							anchorEl={anchorEl}
							open={sortingOpen}
							onClose={sortingCloseHandler}
							PaperProps={{
								sx: {
									mt: '6px',
									boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
									borderRadius: '10px',
									minWidth: '150px',
								},
							}}
						>
							{[
								{ id: 'new', label: 'New' },
								{ id: 'lowest', label: 'Lowest Price' },
								{ id: 'highest', label: 'Highest Price' },
							].map((item) => (
								<MenuItem
									key={item.id}
									onClick={sortingHandler}
									id={item.id}
									disableRipple
									sx={{
										fontSize: '13px',
										color: filterSortName === item.label ? '#d4789a' : '#555',
										fontWeight: filterSortName === item.label ? 600 : 400,
										py: '10px',
										px: '16px',
										'&:hover': { color: '#d4789a', bgcolor: '#fdf5f8' },
									}}
								>
									{item.label}
								</MenuItem>
							))}
						</Menu>
					</div>
				</div>{' '}
			</Box>

			{/* MAIN PRODUCT AREA */}
			<div className="container">
				<div className="product-page">
					{/* LEFT FILTER */}
					<div className="filter-config">
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</div>

					{/* PRODUCT GRID */}
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

			<SubscribeSection />
		</div>
	);

	ProductList.defaultProps = {
		initialInput: {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		},
	};
};

export default withLayoutBasic(ProductList);
