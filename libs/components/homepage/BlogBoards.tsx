import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLE } from '../../../apollo/user/query';

const BlogBoards = () => {
	const device = useDeviceDetect();
	const ref = useRef<HTMLElement>(null);
	const [visible, setVisible] = useState(false);
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getBoardArticlesLoading,
		data: getBoardArticlesData,
		error: getBoardArticlesError,
		refetch: getBoardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getFreeArticles?.list);
		},
	});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold: 0.1 },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	if (device === 'mobile') return null;

	return (
		<section ref={ref} className={`blog-section${visible ? ' in-view' : ''}`}>
			<div className="blog-inner">
				{/* ── Header ── */}
				<div className="blog-header">
					<span className="blog-eyebrow">Journal</span>
					<h2 className="blog-heading">
						Skin wisdom,
						<br />
						<em>beautifully told</em>
					</h2>
				</div>

				{/* ── Two columns ── */}
				<div className="blog-columns">
					{/* Left — News grid */}
					<div className="blog-col blog-col--news">
						<div className="blog-col-header">
							<span>Latest News</span>
							<Link href="/blog?articleCategory=NEWS" className="blog-see-all">
								See all →
							</Link>
						</div>
						<div className="blog-news-grid">
							{newsArticles.map((a, i) => (
								<BlogCard vertical article={a} index={i} key={a._id} />
							))}
						</div>
					</div>

					{/* Divider */}
					<div className="blog-divider" />

					{/* Right — Tips list */}
					<div className="blog-col blog-col--tips">
						<div className="blog-col-header">
							<span>Beauty Tips</span>
							<Link href="/blog?articleCategory=FREE" className="blog-see-all">
								See all →
							</Link>
						</div>
						<div className="blog-tips-list">
							{freeArticles.map((a, i) => (
								<BlogCard vertical={false} article={a} index={i} key={a._id} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BlogBoards;
