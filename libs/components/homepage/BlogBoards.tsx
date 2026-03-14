import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';

const BlogBoards = () => {
	const device = useDeviceDetect();
	const ref = useRef<HTMLElement>(null);
	const [visible, setVisible] = useState(false);

	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	// Apollo Queries
	const { data: newsData, loading: newsLoading } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 6,
				sort: 'articleViews',
				direction: 'DESC', // must match GraphQL enum
				search: { articleCategory: BoardArticleCategory.NEWS },
			},
		},
	});

	const { data: freeData, loading: freeLoading } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 3,
				sort: 'articleViews',
				direction: 'DESC',
				search: { articleCategory: BoardArticleCategory.FREE },
			},
		},
	});

	// Update state when data changes
	useEffect(() => {
		if (newsData?.getBoardArticles?.list) setNewsArticles(newsData.getBoardArticles.list);
		if (freeData?.getBoardArticles?.list) setFreeArticles(freeData.getBoardArticles.list);
	}, [newsData, freeData]);

	// Intersection Observer for animation
	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Hide section on mobile
	if (device === 'mobile') return null;

	return (
		<section ref={ref} className={`blog-section${visible ? ' in-view' : ''}`}>
			<div className="blog-inner">
				{/* Header */}
				<div className="blog-header">
					<span className="blog-eyebrow">Journal</span>
					<h2 className="blog-heading">
						Skin wisdom,
						<br />
						<em>beautifully told</em>
					</h2>
				</div>

				{/* Two columns */}
				<div className="blog-columns">
					{/* News Column */}
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

					{/* Free/Tip Column */}
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
