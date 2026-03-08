import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { BoardArticle } from '../../types/board-article/board-article';

interface BlogCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const BlogCard = ({ vertical, article, index }: BlogCardProps) => {
	const device = useDeviceDetect();

	const articleImage = article?.articleImage
		? `${process.env.NEXT_PUBLIC_API_URL}/${article.articleImage}`
		: '/img/event.svg';

	const linkHref = `/blog/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;

	if (device === 'mobile') return <div>BLOG CARD (MOBILE)</div>;

	if (vertical) {
		return (
			<Link href={linkHref} style={{ animationDelay: `${index * 80}ms` }}>
				<Box className="vertical-card">
					<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
						<div>{index + 1}</div>
					</div>
					<strong>{article?.articleTitle}</strong>
					<span className={'article-category'}>{article?.articleCategory}</span>
				</Box>
			</Link>
		);
	}

	return (
		<Link href={linkHref} style={{ animationDelay: `${index * 100}ms` }}>
			<Box className="horizontal-card">
				<div className={'h-card-img-wrap'}>
					<img src={articleImage} alt={article?.articleTitle} />
				</div>
				<div className={'h-card-body'}>
					<strong>{article?.articleTitle}</strong>
					<span className={'h-card-date'}>{dayjs(article?.createdAt).format('MMM DD, YYYY')}</span>
				</div>
			</Box>
		</Link>
	);
};

export default BlogCard;
