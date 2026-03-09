'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';

// ─── Hardcoded dummy news articles (6) ─────────────────────
const dummyNewsArticles: BoardArticle[] = [
	{
		_id: 'n1',
		articleTitle: 'K-Beauty Trends Taking Over 2025',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news1.jpg',
		articleViews: 340,
		articleLikes: 42,
		articleComments: 8,
		memberId: 'user1',
		createdAt: new Date('2025-02-10'),
		updatedAt: new Date('2025-02-10'),
	},
	{
		_id: 'n2',
		articleTitle: 'Glass Skin: The Science Behind the Trend',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news2.jpg',
		articleViews: 210,
		articleLikes: 31,
		articleComments: 5,
		memberId: 'user2',
		createdAt: new Date('2025-02-08'),
		updatedAt: new Date('2025-02-08'),
	},
	{
		_id: 'n3',
		articleTitle: 'New Centella Launches You Should Know',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news3.jpg',
		articleViews: 188,
		articleLikes: 27,
		articleComments: 3,
		memberId: 'user3',
		createdAt: new Date('2025-02-05'),
		updatedAt: new Date('2025-02-05'),
	},
	{
		_id: 'n4',
		articleTitle: 'SPF 50+ — Why It Matters Every Day',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news4.jpg',
		articleViews: 155,
		articleLikes: 19,
		articleComments: 2,
		memberId: 'user1',
		createdAt: new Date('2025-02-01'),
		updatedAt: new Date('2025-02-01'),
	},
	{
		_id: 'n5',
		articleTitle: 'Niacinamide vs Vitamin C: Which Wins?',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news5.jpg',
		articleViews: 290,
		articleLikes: 38,
		articleComments: 11,
		memberId: 'user2',
		createdAt: new Date('2025-01-28'),
		updatedAt: new Date('2025-01-28'),
	},
	{
		_id: 'n6',
		articleTitle: 'Snail Mucin: Bizarre or Brilliant?',
		articleCategory: BoardArticleCategory.NEWS,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/news6.jpg',
		articleViews: 174,
		articleLikes: 23,
		articleComments: 4,
		memberId: 'user3',
		createdAt: new Date('2025-01-25'),
		updatedAt: new Date('2025-01-25'),
	},
];

// ─── Hardcoded dummy free/tips articles (3) ────────────────
const dummyFreeArticles: BoardArticle[] = [
	{
		_id: 'f1',
		articleTitle: 'Build Your 5-Step Routine for Sensitive Skin',
		articleCategory: BoardArticleCategory.FREE,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/tip1.jpg',
		articleViews: 420,
		articleLikes: 55,
		articleComments: 14,
		memberId: 'user1',
		createdAt: new Date('2025-02-09'),
		updatedAt: new Date('2025-02-09'),
	},
	{
		_id: 'f2',
		articleTitle: 'How to Layer Serums Without Pilling',
		articleCategory: BoardArticleCategory.FREE,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/tip2.jpg',
		articleViews: 310,
		articleLikes: 44,
		articleComments: 9,
		memberId: 'user2',
		createdAt: new Date('2025-02-06'),
		updatedAt: new Date('2025-02-06'),
	},
	{
		_id: 'f3',
		articleTitle: 'Overnight Masks: Do They Actually Work?',
		articleCategory: BoardArticleCategory.FREE,
		articleStatus: BoardArticleStatus.ACTIVE,
		articleContent: '',
		articleImage: 'img/blog/tip3.jpg',
		articleViews: 265,
		articleLikes: 36,
		articleComments: 7,
		memberId: 'user3',
		createdAt: new Date('2025-02-03'),
		updatedAt: new Date('2025-02-03'),
	},
];

// ───────────────────────────────────────────────────────────

const BlogBoards = () => {
	const device = useDeviceDetect();
	const sectionRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	// Scroll-in observer
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.12 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// TODO: swap with real Apollo queries when backend is ready
	const newsArticles: BoardArticle[] = dummyNewsArticles;
	const freeArticles: BoardArticle[] = dummyFreeArticles;

	if (device === 'mobile') return <div>COMMUNITY BOARDS (MOBILE)</div>;

	return (
		<Stack ref={sectionRef} className={`community-board ${visible ? 'is-visible' : ''}`}>
			<Stack className={'container'}>
				{/* ── Header ── */}
				<div className={'board-header'}>
					<span className={'board-eyebrow'}>From Our Journal</span>
					<h2 className={'board-title'}>
						Expert advice for
						<br />
						<em>healthy, glowing skin</em>
					</h2>
				</div>

				<Stack className="community-main">
					{/* ── Left: News ── */}
					<Stack className={'community-left'}>
						<Stack className={'content-top'}>
							<Link href={'/blog?articleCategory=NEWS'}>
								<span>Latest News</span>
							</Link>
							<img src="/img/icons/arrowBig.svg" alt="" />
						</Stack>
						<Stack className={'card-wrap'}>
							{newsArticles.map((article, index) => (
								<BlogCard vertical article={article} index={index} key={article._id} />
							))}
						</Stack>
					</Stack>

					<div className={'center-divider'} />

					{/* ── Right: Free ── */}
					<Stack className={'community-right'}>
						<Stack className={'content-top'}>
							<Link href={'/blog?articleCategory=FREE'}>
								<span>Beauty Tips</span>
							</Link>
							<img src="/img/icons/arrowBig.svg" alt="" />
						</Stack>
						<Stack className={'card-wrap vertical'}>
							{freeArticles.map((article, index) => (
								<BlogCard vertical={false} article={article} index={index} key={article._id} />
							))}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default BlogBoards;
