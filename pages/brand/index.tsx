import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BrandCard from '../../libs/components/common/BrandCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

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
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Views');
				break;
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
				<Stack className={'filter'}>
					<Box component={'div'} className={'left'}>
						<input
							type="text"
							placeholder={'Search for a brand or product'}
							value={searchText}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key === 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
						/>
					</Box>

					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
								<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
									Recent
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
									Oldest
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
									Likes
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
									Views
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Stack>

				<Stack className={'card-wrap'}>
					{brands?.length === 0 ? (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No brands found!</p>
						</div>
					) : (
						brands.map((brand: Member) => {
							return <BrandCard brand={brand} key={brand._id} likeMemberHandler={undefined} />;
						})
					)}
				</Stack>

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
							Total {total} brand{total > 1 ? 's' : ''} available
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
