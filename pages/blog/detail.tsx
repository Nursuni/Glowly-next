import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';

import { Box, Stack, Typography, Button, Pagination } from '@mui/material';

import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';

import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, UPDATE_COMMENT } from '../../apollo/user/mutation';

import { CommentStatus } from '../../libs/enums/comment.enum';
import { userVar } from '../../apollo/store';

const CommunityDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [articleId, setArticleId] = useState<string>('');
	const [boardArticle, setBoardArticle] = useState<any>(null);
	const [memberImage, setMemberImage] = useState<string>('');

	const [comments, setComments] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

	const [comment, setComment] = useState<string>('');
	const [updatedComment, setUpdatedComment] = useState<string>('');

	const [searchFilter, setSearchFilter] = useState({
		page: 1,
		limit: 5,
		search: {
			commentRefId: '',
		},
	});

	/** MUTATIONS **/

	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	/** GET ARTICLE **/

	useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		skip: !articleId,
		onCompleted: (data: any) => {
			if (data?.getBoardArticle) {
				setBoardArticle(data.getBoardArticle);

				setMemberImage(
					data.getBoardArticle?.memberData?.memberImage
						? `${process.env.REACT_APP_API_URL}/${data.getBoardArticle.memberData.memberImage}`
						: '/img/community/articleImg.png',
				);
			}
		},
	});

	/** GET COMMENTS **/

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.commentRefId,
		onCompleted: (data: any) => {
			if (data?.getComments?.list) {
				setComments(data.getComments.list);
				setTotal(data.getComments.metaCounter?.[0]?.total ?? 0);
			}
		},
	});

	/** LIFECYCLE **/

	useEffect(() => {
		if (router.query.articleId) {
			const id = router.query.articleId as string;
			setArticleId(id);

			setSearchFilter((prev) => ({
				...prev,
				search: {
					commentRefId: id,
				},
			}));
		}
	}, [router.query.articleId]);

	useEffect(() => {
		if (searchFilter.search.commentRefId) {
			getCommentsRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/** CREATE COMMENT **/

	const createCommentHandler = async () => {
		try {
			if (!user?._id) {
				alert('Please login first');
				return;
			}

			if (!comment.trim()) {
				alert('Please write a comment');
				return;
			}

			await createComment({
				variables: {
					input: {
						commentGroup: 'BOARD_ARTICLE',
						commentContent: comment,
						commentRefId: articleId,
					},
				},
			});

			setComment('');

			await getCommentsRefetch({ input: searchFilter });
		} catch (err) {
			console.log('create comment error:', err);
		}
	};

	/** UPDATE / DELETE COMMENT **/

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETED) => {
		try {
			await updateComment({
				variables: {
					input: {
						_id: commentId,
						commentContent: updatedComment,
						commentStatus: commentStatus,
					},
				},
			});

			setUpdatedComment('');

			await getCommentsRefetch({ input: searchFilter });
		} catch (err) {
			console.log('update comment error:', err);
		}
	};

	/** PAGINATION **/

	const paginationHandler = (event: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL MOBILE</div>;
	}

	return (
		<Stack className={'community-detail-page'}>
			<Stack className={'container'}>
				{/* ARTICLE */}

				<Box className={'article-box'}>
					<img src={memberImage} />

					<Typography variant="h5">{boardArticle?.articleTitle}</Typography>

					<p>{boardArticle?.articleContent}</p>
				</Box>

				{/* COMMENTS */}

				<Stack className={'comment-section'}>
					<Typography variant="h6">Comments ({total})</Typography>

					{comments.map((comment: any) => (
						<Box key={comment._id} className={'comment-box'}>
							<p>{comment.commentContent}</p>

							{user?._id === comment.memberId && (
								<Stack direction="row" spacing={1}>
									<Button onClick={() => updateButtonHandler(comment._id)}>Update</Button>

									<Button onClick={() => updateButtonHandler(comment._id, CommentStatus.DELETED)}>Delete</Button>
								</Stack>
							)}
						</Box>
					))}

					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit) || 1}
						onChange={paginationHandler}
					/>
				</Stack>

				{/* CREATE COMMENT */}

				<Stack className={'create-comment'}>
					<textarea value={comment} onChange={(e) => setComment(e.target.value)} />

					<Button onClick={createCommentHandler}>Add Comment</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CommunityDetail);
