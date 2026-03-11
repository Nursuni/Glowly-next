import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Typography, Button, Pagination } from '@mui/material';
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
	const tabChangeHandler = async (value: string) => {
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
					<img src={'/img/logo/glowly.svg'} className="mobile-logo" alt="Glowly" />
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
							onClick={() => tabChangeHandler(tab.value)}
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
				{/* ── Page Hero (top) ── */}
				<Stack className="community-hero scroll-reveal">
					<div className="hero-inner">
						<span className="hero-eyebrow">✦ Glowly Community</span>
						<Typography className="hero-title">Open Forum</Typography>
						<Typography className="hero-sub">A space to speak freely — no topic is too big or too small.</Typography>
					</div>
					<div className="hero-deco" aria-hidden="true">
						<span>✦</span>
						<span>♡</span>
						<span>◎</span>
						<span>✿</span>
					</div>
				</Stack>

				{/* ── Two-panel card ── */}
				<Stack className="community-card scroll-reveal">
					{/* LEFT: tab sidebar */}
					<Stack className="card-sidebar">
						<div className="sidebar-brand">
							<img src={'/img/logo/glowly.svg'} alt="Glowly" />
							<span className="brand-label">Community</span>
						</div>

						<nav className="sidebar-tabs">
							{tabs.map((tab) => (
								<button
									key={tab.value}
									className={`sidebar-tab-btn ${currentTab === tab.value ? 'active' : ''}`}
									onClick={() => tabChangeHandler(tab.value)}
								>
									<span className="tab-icon">{tab.icon}</span>
									<span className="tab-label">{tab.label}</span>
									{currentTab === tab.value && <span className="tab-active-bar" />}
								</button>
							))}
						</nav>

						<div className="sidebar-footer">
							<div className="sidebar-divider" />
							<Typography className="sidebar-note">Respectful conversation is always welcome here.</Typography>
						</div>
					</Stack>

					{/* RIGHT: article feed */}
					<Stack className="card-content">
						{/* Content header with Compose button on top-left */}
						<Stack className="content-header">
							<Stack className="content-header-left">
								<div className="content-header-meta">
									<Typography className="content-tab-eyebrow">{currentTab} BOARD</Typography>
									<Typography className="content-tab-title">{meta.title}</Typography>
									<Typography className="content-tab-sub">{meta.sub}</Typography>
								</div>
								<Button
									className="compose-btn"
									onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
								>
									✦ Compose
								</Button>
							</Stack>
						</Stack>

						{/* Article grid */}
						<Stack className="articles-grid">
							{totalCount ? (
								boardArticles?.map((boardArticle: BoardArticle, i: number) => (
									<div className="scroll-reveal" key={boardArticle?._id} style={{ animationDelay: `${i * 70}ms` }}>
										<CommunityCard boardArticle={boardArticle} likeArticleHandler={undefined} />
									</div>
								))
							) : (
								<Stack className="no-data scroll-reveal">
									<span className="no-data-icon">✦</span>
									<p>Nothing here just yet.</p>
									<span className="no-data-cta">{meta.sub}</span>
								</Stack>
							)}
						</Stack>

						{/* Pagination inside card */}
						{totalCount > 0 && (
							<Stack className="card-pagination scroll-reveal">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
								<Typography className="total-count">
									{totalCount} article{totalCount !== 1 ? 's' : ''} in this collection
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
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
