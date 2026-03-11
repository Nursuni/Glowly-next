import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { BoardArticle } from '../../types/board-article/board-article';

interface BlogCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const BlogCard = ({ vertical, article, index }: BlogCardProps) => {
	const image = article?.articleImage ? `${process.env.NEXT_PUBLIC_API_URL}/${article.articleImage}` : '/img/event.svg';

	const href = `/blog/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;

	// ── Vertical card (News grid — left column) ──────────────
	if (vertical) {
		return (
			<Link href={href} className="blog-v-card" style={{ animationDelay: `${index * 70}ms` }}>
				<div className="blog-v-img" style={{ backgroundImage: `url(${image})` }} />
				<p className="blog-v-title">{article?.articleTitle}</p>
			</Link>
		);
	}

	// ── Horizontal card (Tips list — right column) ───────────
	return (
		<Link href={href} className="blog-h-card" style={{ animationDelay: `${index * 90}ms` }}>
			<div className="blog-h-img-wrap">
				<img src={image} alt={article?.articleTitle} />
			</div>
			<div className="blog-h-body">
				<p className="blog-h-title">{article?.articleTitle}</p>
				<span className="blog-h-date">{dayjs(article?.createdAt).format('MMM D, YYYY')}</span>
			</div>
		</Link>
	);
};

export default BlogCard;
