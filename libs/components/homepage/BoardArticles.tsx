import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';

import Link from 'next/link';
import { BoardArticleCategory } from '@/libs/enums/board-article.enum';
import { BoardArticle } from '@/libs/types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '@/apollo/user/query';
import { NEXT_PUBLIC_API_URL } from '@/libs/config';
import dayjs from 'dayjs';

// ─── Category labels ──────────────────────────────────────────────────────────
const CATEGORY_LABEL: Record<BoardArticleCategory, string> = {
	[BoardArticleCategory.FREE]: 'Free Talk',
	[BoardArticleCategory.RECOMMEND]: 'Recommend',
	[BoardArticleCategory.NEWS]: 'News',
	[BoardArticleCategory.QUESTION]: 'Q&A',
	[BoardArticleCategory.REVIEW]: 'Review',
	[BoardArticleCategory.TUTORIAL]: 'Tutorial',
	[BoardArticleCategory.DISCUSSION]: 'Discussion',
	[BoardArticleCategory.ANNOUNCEMENT]: 'Announcement',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function placeholder(seed: string): string {
	const hues = [340, 350, 12, 22, 5];
	const h = hues[seed.charCodeAt(0) % hues.length];
	return `linear-gradient(135deg, hsl(${h},38%,92%) 0%, hsl(${h + 14},32%,86%) 100%)`;
}

// ✅ Prepends API base URL to relative image paths
function imgUrl(path: string | null | undefined): string | null {
	if (!path) return null;
	if (path.startsWith('http')) return path;
	return `${NEXT_PUBLIC_API_URL}/${path}`;
}

// ─── Vertical card (news grid) ────────────────────────────────────────────────
function VerticalCard({ article, delay }: { article: BoardArticle; delay: number }) {
	const image = imgUrl(article.articleImage);
	return (
		<Link
			href={`/blog/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
			className="blog-v-card"
			style={{ transitionDelay: `${delay}ms` }}
		>
			<div
				className="blog-v-img"
				style={{
					backgroundImage: image ? `url(${image})` : placeholder(String(article._id)),
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<p
				className="blog-v-title"
				style={{
					WebkitLineClamp: 2,
					WebkitBoxOrient: 'vertical' as const,
					display: '-webkit-box',
				}}
			>
				{article.articleTitle}
			</p>
			<span
				style={{
					fontFamily: "'Jost', sans-serif",
					fontSize: '10px',
					letterSpacing: '0.14em',
					textTransform: 'uppercase',
					color: '#f564a9',
					fontWeight: 500,
				}}
			>
				{CATEGORY_LABEL[article.articleCategory]}
			</span>
		</Link>
	);
}

// ─── Horizontal card (tips list) ──────────────────────────────────────────────
function HorizontalCard({ article, delay }: { article: BoardArticle; delay: number }) {
	const image = imgUrl(article.articleImage);
	return (
		<Link
			href={`/blog/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
			className="blog-h-card"
			style={{ transitionDelay: `${delay}ms` }}
		>
			<div className="blog-h-img-wrap">
				{image ? (
					<img src={image} alt={article.articleTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
				) : (
					<div style={{ width: '100%', height: '100%', background: placeholder(String(article._id)) }} />
				)}
			</div>
			<div className="blog-h-body">
				<p
					className="blog-h-title"
					style={{
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical' as const,
						display: '-webkit-box',
					}}
				>
					{article.articleTitle}
				</p>
				<span className="blog-h-date">
					{CATEGORY_LABEL[article.articleCategory]} &middot; {dayjs(article.createdAt).format('MMM D, YYYY')}
				</span>
			</div>
		</Link>
	);
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function SkeletonV() {
	const bone = {
		background: 'linear-gradient(90deg,#f5f0ea 25%,#ede6dc 50%,#f5f0ea 75%)',
		backgroundSize: '200% 100%' as const,
		animation: 'blog-shimmer 1.4s infinite',
		borderRadius: 4,
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
			<div style={{ ...bone, width: '100%', aspectRatio: '4/3', borderRadius: 6 }} />
			<div style={{ ...bone, height: 13, width: '82%' }} />
			<div style={{ ...bone, height: 13, width: '55%' }} />
		</div>
	);
}

function SkeletonH() {
	const bone = {
		background: 'linear-gradient(90deg,#f5f0ea 25%,#ede6dc 50%,#f5f0ea 75%)',
		backgroundSize: '200% 100%' as const,
		animation: 'blog-shimmer 1.4s infinite',
		borderRadius: 4,
	};
	return (
		<div
			style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid #f5f0f1', alignItems: 'center' }}
		>
			<div style={{ ...bone, width: 80, height: 60, borderRadius: 5, flexShrink: 0 }} />
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
				<div style={{ ...bone, height: 13, width: '88%' }} />
				<div style={{ ...bone, height: 13, width: '52%' }} />
			</div>
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BoardArticles() {
	const sectionRef = useRef<HTMLElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					obs.disconnect();
				}
			},
			{ threshold: 0.08 },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	// News column
	const { data: newsData, loading: newsLoading } = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 6,
				sort: 'createdAt',
				search: { articleCategory: BoardArticleCategory.NEWS },
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	// Community picks column — sorted by likes
	const { data: tipsData, loading: tipsLoading } = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 5,
				sort: 'articleLikes',
				search: {},
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const newsArticles: BoardArticle[] = newsData?.getBoardArticles?.list ?? [];
	const tipsArticles: BoardArticle[] = tipsData?.getBoardArticles?.list ?? [];

	return (
		<>
			<style>{`
        @keyframes blog-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

			<section ref={sectionRef} className={`blog-section${inView ? ' in-view' : ''}`}>
				<div className="blog-inner">
					{/* ── Section header ───────────────────────────────────── */}
					<div className="blog-header">
						<span className="blog-eyebrow">Community &amp; Stories</span>
						<h2 className="blog-heading">
							Beauty <em>Talks</em>
						</h2>
					</div>

					{/* ── Two-column layout ────────────────────────────────── */}
					<div className="blog-columns">
						{/* LEFT — news grid (3 cols) */}
						<div>
							<div className="blog-col-header">
								<span>Latest News</span>
								<Link href="/blog?articleCategory=NEWS" className="blog-see-all">
									See all →
								</Link>
							</div>

							<div className="blog-news-grid">
								{newsLoading ? (
									Array.from({ length: 6 }).map((_, i) => <SkeletonV key={i} />)
								) : newsArticles.length > 0 ? (
									newsArticles.map((article, i) => (
										<VerticalCard key={article._id as string} article={article} delay={i * 55} />
									))
								) : (
									<p style={{ gridColumn: '1/-1', color: '#a08898', fontSize: 14, fontFamily: "'Jost', sans-serif" }}>
										No news articles yet.
									</p>
								)}
							</div>
						</div>

						{/* Divider */}
						<div className="blog-divider" />

						{/* RIGHT — community picks list */}
						<div>
							<div className="blog-col-header" style={{ transitionDelay: '0.12s' }}>
								<span>Community Picks</span>
								<Link href="/blog?articleCategory=FREE" className="blog-see-all">
									See all →
								</Link>
							</div>

							<div className="blog-tips-list">
								{tipsLoading ? (
									Array.from({ length: 5 }).map((_, i) => <SkeletonH key={i} />)
								) : tipsArticles.length > 0 ? (
									tipsArticles.map((article, i) => (
										<HorizontalCard key={article._id as string} article={article} delay={80 + i * 55} />
									))
								) : (
									<p style={{ color: '#a08898', fontSize: 14, padding: '16px 0', fontFamily: "'Jost', sans-serif" }}>
										No articles yet.
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
