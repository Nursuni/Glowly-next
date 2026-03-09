import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchIcon from '@mui/icons-material/Search';
import BrandCard from '../../libs/components/common/BrandCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SORT_OPTIONS = [
	{ id: 'recent', label: 'Recent', sort: 'createdAt', direction: 'DESC' },
	{ id: 'old', label: 'Oldest', sort: 'createdAt', direction: 'ASC' },
	{ id: 'likes', label: 'Likes', sort: 'memberLikes', direction: 'DESC' },
	{ id: 'views', label: 'Views', sort: 'memberViews', direction: 'DESC' },
];

const BrandList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [brands, setBrands] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

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
	/** LIFECYCLE **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else {
			router.replace(`/brand?input=${JSON.stringify(searchFilter)}`, `/brand?input=${JSON.stringify(searchFilter)}`);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** SORTING **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const option = SORT_OPTIONS.find((o) => o.id === e.currentTarget.id);
		if (option) {
			setSearchFilter({ ...searchFilter, sort: option.sort, direction: option.direction });
			setFilterSortName(option.label);
		}
		sortingCloseHandler();
	};

	/** PAGINATION **/
	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/brand?input=${JSON.stringify(searchFilter)}`, `/brand?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	if (device === 'mobile') {
		return <h1>Brands PAGE MOBILE</h1>;
	}

	return (
		<Stack className={'brand-list-page'}>
			<Stack className={'container'}>
				{/* ── Page heading ── */}
				<Stack className={'page-header'}>
					<span className={'page-header__eyebrow'}>Discover</span>
					<h1 className={'page-header__title'}>Our Brands</h1>
					<p className={'page-header__sub'}>
						{total > 0
							? `We have gathered ${total} wonderful beauty brand${
									total !== 1 ? 's' : ''
							  } — we hope you find something you love.`
							: 'We have handpicked the finest beauty brands to help you discover what you truly love.'}
					</p>
				</Stack>

				{/* ── Filter bar ── */}
				<Stack className={'filter'}>
					<Box component={'div'} className={'left'}>
						<div className={'search-wrap'}>
							<input
								type="text"
								placeholder={'Search for a brand…'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={handleSearchKeyDown}
								className="search-input"
							/>
							<SearchRoundedIcon className="search-icon" onClick={handleSearchSubmit} />
						</div>
					</Box>

					<Box component={'div'} className={'right'}>
						<span className={'sort-label'}>Sort by</span>
						<div className={'sort-btn-wrap'}>
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
					</Box>
				</Stack>

				{/* ── Cards ── */}
				<Stack className={'card-wrap'}>
					{brands?.length === 0 ? (
						<div className={'no-data'}>
							<span className="no-data-icon">✦</span>
							<p>We couldn't find any brands matching your search.</p>
							<span className="no-data-cta">Try adjusting your filters or search with a different keyword.</span>
						</div>
					) : (
						brands.map((brand: Member) => <BrandCard brand={brand} key={brand._id} likeMemberHandler={undefined} />)
					)}
				</Stack>

				{/* ── Pagination ── */}
				<Stack className={'pagination'}>
					{brands.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={paginationChangeHandler}
							shape="circular"
							color="primary"
						/>
					)}
					{brands.length !== 0 && (
						<span>
							Showing {total} beautiful brand{total !== 1 ? 's' : ''} for you
						</span>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

BrandList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(BrandList);
