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

const tabs = [
	{ value: 'FREE', label: 'Open Forum', icon: '✦' },
	{ value: 'RECOMMEND', label: 'Recommendations', icon: '♡' },
	{ value: 'NEWS', label: 'Beauty News', icon: '◎' },
	{ value: 'HUMOR', label: 'Lighthearted', icon: '✿' },
];

const tabMeta: Record<string, { title: string; sub: string }> = {
	FREE: { title: 'Open Forum', sub: 'A space to speak freely — no topic is too big or too small.' },
	RECOMMEND: { title: 'Recommendations', sub: 'Discover what the community loves and trusts.' },
	NEWS: { title: 'Beauty News', sub: 'The latest launches, trends, and stories worth knowing.' },
	HUMOR: { title: 'Lighthearted', sub: 'A little laughter goes a long way — share the joy.' },
};

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push({ pathname: router.pathname, query: { articleCategory: 'FREE' } }, router.pathname, {
				shallow: true,
			});
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add('in-view');
				}),
			{ threshold: 0.08 },
		);
		document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [boardArticles]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push({ pathname: '/blog', query: { articleCategory: value } }, router.pathname, { shallow: true });
	};

	const paginationHandler = (e: T, value: number) => setSearchCommunity({ ...searchCommunity, page: value });

	const currentTab = searchCommunity.search.articleCategory;
	const meta = tabMeta[currentTab] ?? tabMeta['FREE'];

	if (device === 'mobile') {
		return (
			<div id="community-list-page" className="mobile">
				{/* Mobile Hero */}
				<div className="mobile-hero scroll-reveal">
					<div className="mobile-hero-glow" />
					<img src={'/img/logo/logoText.svg'} className="mobile-logo" alt="Glowly" />
					<Typography className="mobile-community-title">Community</Typography>
					<Typography className="mobile-community-sub">
						Where beauty enthusiasts connect, share, and inspire.
					</Typography>
				</div>

				{/* Mobile Tab Pills */}
				<div className="mobile-tab-bar">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							className={`mobile-tab-pill ${currentTab === tab.value ? 'active' : ''}`}
							onClick={(e) => tabChangeHandler(e, tab.value)}
						>
							<span className="pill-icon">{tab.icon}</span>
							{tab.label}
						</button>
					))}
				</div>

				{/* Mobile Content */}
				<div className="mobile-content-area">
					<div className="mobile-board-header scroll-reveal">
						<div>
							<Typography className="mobile-board-title">{meta.title}</Typography>
							<Typography className="mobile-board-sub">{meta.sub}</Typography>
						</div>
						<Button
							className="mobile-write-btn"
							onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
						>
							+ Compose
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
								<span className="no-data-icon">✦</span>
								<p>No articles have been shared here yet.</p>
								<span className="no-data-cta">Be the first to write something beautiful.</span>
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
						{/* ── Sidebar ── */}
						<Stack className="left-config scroll-reveal">
							<Stack className="image-info">
								<img src={'/img/logo/logoText.svg'} alt="Glowly" />
								<Stack className="community-name">
									<span className="name-eyebrow">✦ Community</span>
									<Typography className="name">Glowly</Typography>
									<Typography className="name-sub">Where beauty finds its voice.</Typography>
								</Stack>
							</Stack>

							<TabList
								orientation="vertical"
								aria-label="Community categories"
								TabIndicatorProps={{ style: { display: 'none' } }}
								onChange={tabChangeHandler}
							>
								{tabs.map((tab) => (
									<Tab
										key={tab.value}
										value={tab.value}
										label={
											<span className="tab-label-inner">
												<span className="tab-icon">{tab.icon}</span>
												{tab.label}
											</span>
										}
										className={`tab-button ${currentTab === tab.value ? 'active' : ''}`}
									/>
								))}
							</TabList>

							<div className="sidebar-divider" />
							<Typography className="sidebar-note">Respectful conversation is always welcome here.</Typography>
						</Stack>

						{/* ── Main content ── */}
						<Stack className="right-config">
							<Stack className="panel-config">
								<Stack className="title-box scroll-reveal">
									<Stack className="left">
										<span className="title-eyebrow">{currentTab} BOARD</span>
										<Typography className="title">{meta.title}</Typography>
										<Typography className="sub-title">{meta.sub}</Typography>
									</Stack>
									<Button
										className="write-btn"
										onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
									>
										✦ Compose
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
												<Stack className="no-data scroll-reveal">
													<span className="no-data-icon">✦</span>
													<p>Nothing here just yet.</p>
													<span className="no-data-cta">Be the first to share something with the community.</span>
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
								{totalCount} article{totalCount !== 1 ? 's' : ''} in this collection
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
