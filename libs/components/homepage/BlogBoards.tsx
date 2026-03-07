import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';

import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLE } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';

const BlogBoards = () => {
	const device = useDeviceDetect();

	const [searchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});

	/** NEWS ARTICLES **/
	const { data: newsData } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 6,
				search: {
					articleCategory: BoardArticleCategory.NEWS,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	/** FREE ARTICLES **/
	const { data: freeData } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 3,
				search: {
					articleCategory: BoardArticleCategory.FREE,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	const newsArticles: BoardArticle[] = newsData?.getBoardArticles?.list ?? [];
	const freeArticles: BoardArticle[] = freeData?.getBoardArticles?.list ?? [];

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	}

	return (
		<Stack className={'community-board'}>
			<Stack className={'container'}>
				<Stack>
					<Typography variant={'h1'}>Blog</Typography>
					<Typography variant={'h1'}>Expert advice, tips and tricks for healthy, glowing skin</Typography>
				</Stack>

				<Stack className="community-main">
					{/* LEFT SIDE - NEWS */}
					<Stack className={'community-left'}>
						<Stack className={'content-top'}>
							<Link href={'/blog?articleCategory=NEWS'}>
								<span>News</span>
							</Link>
							<img src="/img/icons/arrowBig.svg" alt="" />
						</Stack>

						<Stack className={'card-wrap'}>
							{newsArticles.map((article, index) => (
								<BlogCard vertical article={article} index={index} key={article._id} />
							))}
						</Stack>
					</Stack>

					{/* RIGHT SIDE - FREE */}
					<Stack className={'community-right'}>
						<Stack className={'content-top'}>
							<Link href={'/blog?articleCategory=FREE'}>
								<span>Free</span>
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
