'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLE } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import BlogCard from './BlogCard';

const BlogBoards = () => {
	const device = useDeviceDetect();
	const sectionRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	const [searchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});

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

	const { data: newsData } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 6,
				search: { articleCategory: BoardArticleCategory.NEWS },
			},
		},
	});

	const { data: freeData } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 3,
				search: { articleCategory: BoardArticleCategory.FREE },
			},
		},
	});

	const newsArticles: BoardArticle[] = newsData?.getBoardArticles?.list ?? [];
	const freeArticles: BoardArticle[] = freeData?.getBoardArticles?.list ?? [];

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
