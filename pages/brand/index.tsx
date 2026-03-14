import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Pagination } from '@mui/material';

import BrandCard from '../../libs/components/common/BrandCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';

import Toolbar from '../../libs/components/common/Toolbar';
import { LIKE_TARGET_MEMBER } from '@/apollo/user/mutation';
import { T } from '@/libs/types/common';
import { GET_BRANDS } from '@/apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { Message } from '@/libs/enums/common.enum';
import { toastError, toastSuccess } from '@/libs/toast';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SORT_OPTIONS = [
	{ id: 'recent', label: 'Recent', sort: 'createdAt', direction: 'ASC' },
	{ id: 'old', label: 'Oldest', sort: 'createdAt', direction: 'DESC' },
	{ id: 'likes', label: 'Likes', sort: 'memberLikes', direction: 'DESC' },
	{ id: 'views', label: 'Views', sort: 'memberViews', direction: 'DESC' },
];

const BrandList: NextPage<{ initialInput: T }> = ({ initialInput }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);

	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router.query.input as string) : initialInput,
	);
	const [brands, setBrands] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const { refetch: getBrandsRefetch } = useQuery(GET_BRANDS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBrands(data?.getBrands?.list ?? []);
			setTotal(data?.getBrands?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** SEARCH **/
	const handleSearchSubmit = async () => {
		const updatedFilter = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		};
		setSearchFilter(updatedFilter);
		setCurrentPage(1);
		await router.push({ pathname: '/brand', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSearchSubmit();
	};

	/** LIFECYCLE **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
		} else {
			router.replace(`/brand?input=${JSON.stringify(searchFilter)}`, `/brand?input=${JSON.stringify(searchFilter)}`);
		}
		setCurrentPage(searchFilter.page ?? 1);
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
			const updatedFilter = { ...searchFilter, sort: option.sort, direction: option.direction };
			setSearchFilter(updatedFilter);
			setFilterSortName(option.label);
			router.push({ pathname: '/brand', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
				scroll: false,
			});
		}
		sortingCloseHandler();
	};

	/** PAGINATION **/
	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };
		window.scrollTo({ top: 0, behavior: 'smooth' });

		await router.push(`/brand?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });

		setSearchFilter(updatedFilter);
		setCurrentPage(value);
	};

	/** LIKE MEMBER **/
	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({ variables: { input: id } });
			await getBrandsRefetch({ input: searchFilter });
			toastSuccess('Success');
		} catch (err) {
			toastError(err instanceof Error ? err.message : String(err));
			console.log('likeMemberHandler error:', err);
		}
	};

	if (device === 'mobile') return <h1>Brands PAGE MOBILE</h1>;

	return (
		<Stack className="brand-list-page">
			<Stack className="container">
				{/* Page heading */}
				<Stack className="page-header">
					<span className="page-header__eyebrow">Discover</span>
					<h1 className="page-header__title">Our Brands</h1>
					<p className="page-header__sub">
						{total > 0
							? `We have gathered ${total} wonderful beauty brand${
									total !== 1 ? 's' : ''
							  } — we hope you find something you love.`
							: 'We have handpicked the finest beauty brands to help you discover what you truly love.'}
					</p>
				</Stack>

				{/* Toolbar */}
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

				{/* Brand cards */}
				<Stack className="card-wrap">
					{brands.length === 0 ? (
						<div className="no-data">
							<span className="no-data-icon">✦</span>
							<p>We couldn't find any brands matching your search.</p>
							<span className="no-data-cta">Try adjusting your filters or search with a different keyword.</span>
						</div>
					) : (
						brands.map((brand: Member) => (
							<BrandCard brand={brand} key={brand._id} likeMemberHandler={likeMemberHandler} />
						))
					)}
				</Stack>

				{/* Pagination */}
				{brands.length > 0 && Math.ceil(total / searchFilter.limit) > 1 && (
					<Stack className="pagination">
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={paginationChangeHandler}
							shape="circular"
							color="primary"
						/>
						<span>
							Showing {total} beautiful brand{total !== 1 ? 's' : ''} for you
						</span>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

BrandList.defaultProps = {
	initialInput: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default withLayoutBasic(BrandList);
