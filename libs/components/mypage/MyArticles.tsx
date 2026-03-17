import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography, Button } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';

import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE, REMOVE_BOARD_ARTICLE } from '../../../apollo/user/mutation';

import { Messages } from '../../config';
import { toastError, toastSuccess } from '../../toast';
import { Direction } from '@/libs/enums/common.enum';

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

			await likeTargetBoardArticle({
				variables: { articleId: id },
			});

			await refetch();
			toastSuccess('Liked!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const deleteHandler = async (e: any, id: string) => {
		try {
			e.stopPropagation();

			const confirmDelete = window.confirm('Are you sure you want to delete this article?');

			if (!confirmDelete) return;

			await removeBoardArticle({
				variables: { articleId: id },
			});

			await refetch();

			toastSuccess('Article deleted successfully!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const openArticle = (id: string) => {
		router.push(`/blog/detail?id=${id}`);
	};

	if (device === 'mobile') return <>ARTICLE PAGE MOBILE</>;

	return (
		<div id="my-articles-page">
			<Stack className="main-title-box">
				<Typography variant="h4">My Articles</Typography>
			</Stack>

			<Stack spacing={3}>
				{boardArticles?.length > 0 ? (
					boardArticles.map((article: BoardArticle) => (
						<Stack
							key={article._id}
							sx={{
								border: '1px solid #ddd',
								padding: '20px',
								borderRadius: '10px',
								cursor: 'pointer',
							}}
							onClick={() => openArticle(article._id)}
						>
							<Typography fontWeight="bold" fontSize="18px">
								{article.articleTitle}
							</Typography>

							<Typography fontSize="14px">{new Date(article.createdAt).toLocaleDateString()}</Typography>

							<Stack direction="row" spacing={2} mt={2}>
								<Button size="small" variant="outlined" onClick={(e) => likeHandler(e, article._id)}>
									❤️ {article.articleLikes}
								</Button>

								{article.memberId === user?._id && (
									<Button size="small" color="error" variant="contained" onClick={(e) => deleteHandler(e, article._id)}>
										Delete
									</Button>
								)}
							</Stack>
						</Stack>
					))
				) : (
					<Typography>No Articles found!</Typography>
				)}
			</Stack>

			{boardArticles?.length > 0 && (
				<Stack mt={5} alignItems="center">
					<Pagination
						count={Math.ceil(totalCount / searchCommunity.limit)}
						page={searchCommunity.page}
						onChange={paginationHandler}
					/>

					<Typography mt={2}>Total {totalCount ?? 0} article(s)</Typography>
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
