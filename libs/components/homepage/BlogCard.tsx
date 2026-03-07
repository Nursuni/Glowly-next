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

	if (device === 'mobile') {
		return <div>BLOG CARD (MOBILE)</div>;
	}

	if (vertical) {
		return (
			<Link href={linkHref}>
				<Box component="div" className="vertical-card">
					<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
						<div>{index + 1}</div>
					</div>

					<strong>{article?.articleTitle}</strong>
					<span>{article?.articleCategory}</span>
				</Box>
			</Link>
		);
	}

	return (
		<Link href={linkHref}>
			<Box component="div" className="horizontal-card">
				<img src={articleImage} alt={article?.articleTitle} />

				<div>
					<strong>{article?.articleTitle}</strong>

					<span>{dayjs(article?.createdAt).format('DD.MM.YY')}</span>
				</div>
			</Box>
		</Link>
	);
};

export default BlogCard;
