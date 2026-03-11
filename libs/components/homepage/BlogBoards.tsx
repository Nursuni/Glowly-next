import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';

const dummyNews: BoardArticle[] = [
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

const dummyTips: BoardArticle[] = [
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

const BlogBoards = () => {
	const device = useDeviceDetect();
	const ref = useRef<HTMLElement>(null);
	const [visible, setVisible] = useState(false);

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
							{dummyNews.map((a, i) => (
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
							{dummyTips.map((a, i) => (
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
