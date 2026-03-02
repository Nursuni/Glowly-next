import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TuneIcon from '@mui/icons-material/Tune';
import { Member } from '../../libs/types/member/member';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';

import SearchIcon from '@mui/icons-material/Search';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { GET_SELLERS } from '../../apollo/user/query';
import { toastError, toastSuccess } from '../../libs/toast';
import SellerCard from '../../libs/components/common/SellerCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SellerList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [sellers, setSellers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const [showSearch, setShowSearch] = useState<boolean>(false);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getSellersLoading,
		data: getSellersData,
		error: getSellersError,
		refetch: getSellersRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellers(data?.getSellers?.list);
			setTotal(data?.getSellers?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/seller?input=${JSON.stringify(searchFilter)}`, `/seller?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
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
				setFilterSortName('Oldest order');
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
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/seller?input=${JSON.stringify(searchFilter)}`,
			`/seller?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({
				variables: { input: id },
			});

			await getSellersRefetch({ input: searchFilter });
			await toastSuccess('success');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.log('errors, likeProperrtyMember:', errorMessage);
			toastError(errorMessage);
		}
	};
	const handleSearch = () => {
		setSearchFilter({
			...searchFilter,
			search: { ...searchFilter.search, text: searchText },
		});
		setShowSearch(false);
	};
	if (device === 'mobile') {
		return (
			<Stack className={'seller-list-page'}>
				<Stack className={'container'}>
					{/* Mobile Header */}
					<Stack className={'mobile-header'}>
						<Box className={'title-row'}>
							<h1>Our Sellers</h1>
							<Box className={'header-actions'}>
								<Button
									className={'search-btn'}
									onClick={() => setShowSearch(!showSearch)}
									startIcon={<SearchIcon />}
								/>
								<Button className={'filter-btn'} onClick={sortingClickHandler} startIcon={<TuneIcon />} />
							</Box>
						</Box>

						{/* Search Bar (Collapsible) */}
						{showSearch && (
							<Box className={'mobile-search'}>
								<input
									type="text"
									placeholder={'Search for an seller'}
									value={searchText}
									onChange={(e: any) => setSearchText(e.target.value)}
									onKeyDown={(event: any) => {
										if (event.key === 'Enter') {
											handleSearch();
										}
									}}
								/>
								<Button onClick={handleSearch} className={'search-submit'}>
									<SearchIcon />
								</Button>
							</Box>
						)}

						{/* Sort Info */}
						<Box className={'sort-info'}>
							<span className={'result-count'}>
								{total} seller{total !== 1 ? 's' : ''} found
							</span>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />} className={'sort-btn'}>
								{filterSortName}
							</Button>
						</Box>

						{/* Sort Menu */}
						<Menu
							anchorEl={anchorEl}
							open={sortingOpen}
							onClose={sortingCloseHandler}
							sx={{
								'.MuiPaper-root': {
									width: '200px',
									marginTop: '8px',
								},
							}}
						>
							<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
								Recent
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
								Oldest
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
								Most Liked
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
								Most Viewed
							</MenuItem>
						</Menu>
					</Stack>

					{/* Seller Cards */}
					<Stack className={'card-wrap'}>
						{getSellersLoading ? (
							<Box className={'loading'}>
								<p>Loading sellers...</p>
							</Box>
						) : sellers?.length === 0 ? (
							<Box className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Sellers found!</p>
							</Box>
						) : (
							sellers.map((seller: Member) => {
								return <SellerCard seller={seller} key={seller._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>

					{/* Pagination */}
					{sellers.length !== 0 && (
						<Stack className={'pagination'}>
							{Math.ceil(total / searchFilter.limit) > 1 && (
								<Pagination
									page={currentPage}
									count={Math.ceil(total / searchFilter.limit)}
									onChange={paginationChangeHandler}
									shape="circular"
									color="primary"
									size="small"
								/>
							)}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'seller-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<input
								type="text"
								placeholder={'Search for an seller'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
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
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
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
						{sellers?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Sellers found!</p>
							</div>
						) : (
							sellers.map((seller: Member) => {
								return <SellerCard seller={seller} key={seller._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>
					<Stack className={'pagination'}>
						<Stack className="pagination-box">
							{sellers.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{sellers.length !== 0 && (
							<span>
								Total {total} seller{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

SellerList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(SellerList);
