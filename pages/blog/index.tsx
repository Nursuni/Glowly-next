import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const headerRef = useRef<HTMLDivElement>(null);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push({ pathname: router.pathname, query: { articleCategory: 'FREE' } }, router.pathname, {
				shallow: true,
			});
	}, []);

	// Scroll animation observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('in-view');
					}
				});
			},
			{ threshold: 0.1 },
		);
		document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [boardArticles]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push({ pathname: '/blog', query: { articleCategory: value } }, router.pathname, { shallow: true });
		setMobileMenuOpen(false);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const tabs = [
		{ value: 'FREE', label: 'Free Board' },
		{ value: 'RECOMMEND', label: 'Recommendation' },
		{ value: 'NEWS', label: 'News' },
		{ value: 'HUMOR', label: 'Humor' },
	];

	const currentTab = searchCommunity.search.articleCategory;

	if (device === 'mobile') {
		return (
			<div id="community-list-page" className="mobile">
				{/* Mobile Hero Header */}
				<div className="mobile-hero scroll-reveal">
					<div className="mobile-hero-glow" />
					<img src={'/img/logo/logoText.svg'} className="mobile-logo" alt="logo" />
					<Typography className="mobile-community-title">Glowly</Typography>
					<Typography className="mobile-community-sub">Share beauty tips, news & more</Typography>
				</div>

				{/* Mobile Category Scrollbar */}
				<div className="mobile-tab-bar">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							className={`mobile-tab-pill ${currentTab === tab.value ? 'active' : ''}`}
							onClick={(e) => tabChangeHandler(e, tab.value)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Mobile Content */}
				<div className="mobile-content-area">
					<div className="mobile-board-header scroll-reveal">
						<div>
							<Typography className="mobile-board-title">{currentTab} BOARD</Typography>
							<Typography className="mobile-board-sub">Express your opinions freely</Typography>
						</div>
						<Button
							className="mobile-write-btn"
							onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
						>
							+ Write
						</Button>
					</div>

					<Stack className="mobile-list-box">
						{totalCount ? (
							boardArticles?.map((boardArticle: BoardArticle, i: number) => (
								<div className="scroll-reveal" key={boardArticle?._id} style={{ animationDelay: `${i * 60}ms` }}>
									<CommunityCard boardArticle={boardArticle} likeArticleHandler={undefined} />
								</div>
							))
						) : (
							<Stack className="no-data scroll-reveal">
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No articles found yet</p>
							</Stack>
						)}
					</Stack>

					{totalCount > 0 && (
						<Stack className="mobile-pagination scroll-reveal">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
					)}
				</div>
			</div>
		);
	}

	// PC VERSION
	return (
		<div id="community-list-page">
			<div className="container">
				<TabContext value={searchCommunity.search.articleCategory}>
					<Stack className="main-box">
						<Stack className="left-config scroll-reveal">
							<Stack className={'image-info'}>
								<img src={'/img/logo/logoText.svg'} />
								<Stack className={'community-name'}>
									<Typography className={'name'}>Glowly</Typography>
								</Stack>
							</Stack>
							<TabList
								orientation="vertical"
								aria-label="Community tabs"
								TabIndicatorProps={{ style: { display: 'none' } }}
								onChange={tabChangeHandler}
							>
								{tabs.map((tab) => (
									<Tab
										key={tab.value}
										value={tab.value}
										label={tab.label}
										className={`tab-button ${searchCommunity.search.articleCategory === tab.value ? 'active' : ''}`}
									/>
								))}
							</TabList>
						</Stack>

						<Stack className="right-config">
							<Stack className="panel-config">
								<Stack className="title-box scroll-reveal">
									<Stack className="left">
										<Typography className="title">{searchCommunity.search.articleCategory} BOARD</Typography>
										<Typography className="sub-title">
											Share your thoughts and experiences freely—no content restrictions.
										</Typography>
									</Stack>
									<Button
										className="right"
										onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
									>
										Write
									</Button>
								</Stack>

								{tabs.map((tab) => (
									<TabPanel key={tab.value} value={tab.value}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle, i: number) => (
													<div
														className="scroll-reveal"
														key={boardArticle?._id}
														style={{ animationDelay: `${i * 70}ms` }}
													>
														<CommunityCard boardArticle={boardArticle} likeArticleHandler={undefined} />
													</div>
												))
											) : (
												<Stack className={'no-data scroll-reveal'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								))}
							</Stack>
						</Stack>
					</Stack>
				</TabContext>

				{totalCount > 0 && (
					<Stack className="pagination-config scroll-reveal">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {totalCount} article{totalCount > 1 ? 's' : ''} available
							</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: { articleCategory: 'FREE' },
	},
};

export default withLayoutBasic(Community);
