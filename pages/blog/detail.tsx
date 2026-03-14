import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Box, Stack, Typography, Button, Pagination, TextField, Backdrop, IconButton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { userVar } from '../../apollo/store';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, UPDATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { toastError, toastSuccess } from '@/libs/toast';

interface BoardArticle {
	_id: string;
	articleTitle: string;
	articleContent: string;
	articleLikes: number;
	articleViews: number;
	articleComments: number;
	meLiked?: { myFavorite: boolean }[];
	memberData?: { _id: string; memberNick?: string; memberImage?: string };
}

interface CommentType {
	_id: string;
	commentContent: string;
	memberId: string;
	memberData?: { _id: string; memberNick?: string; memberImage?: string };
}

const CommunityDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const articleId = router.query.articleId as string;

	const [boardArticle, setBoardArticle] = useState<BoardArticle>();
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');

	const [comments, setComments] = useState<CommentType[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState({ page: 1, limit: 5, search: { commentRefId: '' } });

	const [commentInput, setCommentInput] = useState('');
	const [editingComments, setEditingComments] = useState<Record<string, string>>({});
	const [updatedCommentId, setUpdatedCommentId] = useState('');
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState(0);
	const [openBackdrop, setOpenBackdrop] = useState(false);
	const [likeLoading, setLikeLoading] = useState(false);

	/** APOLLO MUTATIONS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	/** GET ARTICLE **/
	const { refetch: boardArticleRefetch } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		skip: !articleId,
		onCompleted: (data: any) => {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data.getBoardArticle.memberData.memberImage}`);
			}
		},
	});

	/** GET COMMENTS **/
	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.commentRefId,
		onCompleted: (data: any) => {
			setComments(data?.getComments?.list || []);
			setTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLE **/
	useEffect(() => {
		if (articleId) {
			setSearchFilter((prev) => ({ ...prev, search: { commentRefId: articleId } }));
		}
	}, [articleId]);

	useEffect(() => {
		if (searchFilter.search.commentRefId) {
			getCommentsRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const likeBoArticleHandler = async (user: any, id: string) => {
		try {
			if (likeLoading) return;
			if (!user?._id) throw new Error('Please login first');
			setLikeLoading(true);

			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticleRefetch({ input: articleId });
			await toastSuccess('Success!');
		} catch (err: any) {
			console.log('ERROR, likeBoArticleHandler:', err.message);
			toastError(err.message);
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Please login first');
			if (!commentInput.trim()) return;
			await createComment({
				variables: {
					input: { commentGroup: 'BOARD_ARTICLE', commentRefId: articleId, commentContent: commentInput },
				},
			});
			setCommentInput('');
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			await toastSuccess('Comment added!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETED) => {
		try {
			if (!user?._id) throw new Error('Please login first');
			const content = commentStatus ? '' : editingComments[commentId] || '';
			if (!content && !commentStatus) return;

			const confirmed = window.confirm('Do you want to delete this comment?');
			if (!confirmed) return;

			await updateComment({
				variables: { input: { _id: commentId, commentContent: content, commentStatus } },
			});

			setEditingComments((prev) => ({ ...prev, [commentId]: '' }));
			setUpdatedCommentId('');
			setUpdatedCommentWordsCnt(0);
			setOpenBackdrop(false);
			await getCommentsRefetch({ input: searchFilter });
			await toastSuccess(commentStatus ? 'Deleted!' : 'Updated!');
		} catch (err: any) {
			await toastError(err.message);
		}
	};

	const getCommentMemberImage = (imageUrl?: string) =>
		imageUrl ? `${process.env.REACT_APP_API_URL}/${imageUrl}` : '/img/community/articleImg.png';

	const paginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') return <div>COMMUNITY DETAIL MOBILE</div>;

	return (
		<Stack className="community-detail-page">
			<Stack className="container">
				<Box className="article-box">
					<img src={memberImage} alt="author" />
					<Typography variant="h5">{boardArticle?.articleTitle}</Typography>
					<Typography>{boardArticle?.articleContent}</Typography>
					<Stack direction="row" spacing={2}>
						<Button onClick={() => likeBoArticleHandler(user, boardArticle?._id || '')}>
							{boardArticle?.meLiked?.[0]?.myFavorite ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
							<Typography>{boardArticle?.articleLikes}</Typography>
						</Button>
						<Typography>
							<VisibilityIcon /> {boardArticle?.articleViews}
						</Typography>
						<Typography>
							<ChatBubbleOutlineRoundedIcon /> {boardArticle?.articleComments}
						</Typography>
					</Stack>
				</Box>

				{/* Comments Section */}
				<Stack className="comment-section">
					<Typography>Comments ({total})</Typography>

					{comments.map((c) => (
						<Box key={c._id} className="comment-box">
							{user?._id === c.memberId ? (
								<TextField
									fullWidth
									variant="outlined"
									value={editingComments[c._id] ?? c.commentContent}
									onChange={(e) => setEditingComments((prev) => ({ ...prev, [c._id]: e.target.value.slice(0, 100) }))}
								/>
							) : (
								<p>{c.commentContent}</p>
							)}

							{user?._id === c.memberId && (
								<Stack direction="row" spacing={1}>
									<Button onClick={() => updateButtonHandler(c._id)}>Update</Button>
									<Button onClick={() => updateButtonHandler(c._id, CommentStatus.DELETED)}>Delete</Button>
								</Stack>
							)}
						</Box>
					))}

					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit) || 1}
						onChange={paginationHandler}
					/>

					<Stack className="create-comment">
						<textarea
							value={commentInput}
							onChange={(e) => setCommentInput(e.target.value.slice(0, 100))}
							placeholder="Leave a comment"
						/>
						<Button onClick={createCommentHandler}>Add Comment</Button>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CommunityDetail);
