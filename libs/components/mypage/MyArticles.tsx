import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE, REMOVE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Messages } from '../../config';
import { toastError, toastSuccess } from '../../toast';
import { Direction } from '@/libs/enums/common.enum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import dayjs from 'dayjs';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { T } from '@/libs/types/common';

const MyArticles: NextPage = ({ initialInput }: T) => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const [searchCommunity, setSearchCommunity] = useState({
		...initialInput,
		search: { memberId: user?._id },
	});

	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [removeBoardArticle] = useMutation(REMOVE_BOARD_ARTICLE);

	const { refetch } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		onCompleted(data: T) {
			console.log('article data:', data?.getBoardArticles?.list?.[0]);
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeHandler = async (e: any, id: string) => {
		try {
			e.stopPropagation();
			if (!user?._id) throw new Error(Messages.LOGIN_REQUIRED);
			await likeTargetBoardArticle({ variables: { input: id } });
			await refetch();
			toastSuccess('Liked!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const deleteHandler = async (e: any, id: string) => {
		try {
			e.stopPropagation();
			if (!window.confirm('Are you sure you want to delete this article?')) return;

			await removeBoardArticle({ variables: { articleId: id } });

			// ✅ Remove instantly from local state — don't rely on refetch
			setBoardArticles((prev) => prev.filter((a) => a._id !== id));
			setTotalCount((prev) => prev - 1);

			toastSuccess('Article deleted!');
		} catch (err: any) {
			toastError(err.message);
		}
	};
	const openArticle = (id: string) =>
		router.push({
			pathname: '/blog/detail',
			query: { articleId: id },
		});

	if (device === 'mobile') return <div>ARTICLE PAGE MOBILE</div>;

	return (
		<div id="my-articles-page">
			{/* ── Header ── */}
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">My Articles</Typography>
					<Typography className="sub-title">Your published stories & beauty tips</Typography>
				</Stack>
			</Stack>

			{/* ── Grid ── */}
			{boardArticles?.length === 0 ? (
				<div className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="no articles" />
					<p>You haven't written any articles yet.</p>
				</div>
			) : (
				<div className="article-list-box">
					{boardArticles.map((article: BoardArticle) => {
						const cover = article?.articleImage ? `${NEXT_PUBLIC_API_URL}/${article.articleImage}` : null;

						const isLiked = article?.meLiked?.[0]?.myFavorite;
						const isMine = article.memberId === user?._id;

						return (
							<div key={article._id} className="article-card" onClick={() => openArticle(article._id)}>
								{/* Cover image */}
								<div className="article-cover">
									{cover ? (
										<img src={cover} alt={article.articleTitle} />
									) : (
										<div className="article-cover-placeholder">
											<span>{article.articleTitle?.[0] ?? '✦'}</span>
										</div>
									)}
									<span className="article-category">{article.articleCategory ?? 'Beauty'}</span>
								</div>
								{/* Body */}
								<div className="article-body">
									<p className="article-date">{dayjs(article.createdAt).format('DD MMM, YYYY')}</p>
									<strong className="article-title">{article.articleTitle}</strong>

									{/* Footer */}
									<div className="article-footer">
										<div className="article-stats">
											{/* Views */}
											<span className="stat">
												<RemoveRedEyeIcon className="stat-icon" />
												{article.articleViews ?? 0}
											</span>

											{/* Likes */}
											<span
												className={`stat stat--like ${isLiked ? 'liked' : ''}`}
												onClick={(e) => likeHandler(e, article._id)}
											>
												{isLiked ? (
													<FavoriteIcon className="stat-icon stat-icon--heart active" />
												) : (
													<FavoriteBorderIcon className="stat-icon stat-icon--heart" />
												)}
												{article.articleLikes ?? 0}
											</span>
										</div>

										{/* Delete — only owner */}
										{isMine && (
											<button className="article-delete" onClick={(e) => deleteHandler(e, article._id)}>
												<DeleteOutlineIcon />
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* ── Pagination ── */}
			{boardArticles?.length > 0 && (
				<Stack className="pagination-conf">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(totalCount / searchCommunity.limit)}
							page={searchCommunity.page}
							onChange={paginationHandler}
							shape="circular"
							color="primary"
						/>
					</Stack>
					<Stack className="total">
						<Typography>
							Total {totalCount ?? 0} article{totalCount !== 1 ? 's' : ''}
						</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MyArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default MyArticles;
