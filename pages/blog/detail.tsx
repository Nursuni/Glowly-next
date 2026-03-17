import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Stack, Typography, Button, Pagination, TextField } from '@mui/material';
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

const BlogDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const articleId = router.query.articleId as string;

	const [boardArticle, setBoardArticle] = useState<any>();
	const [comments, setComments] = useState<any[]>([]);
	const [total, setTotal] = useState(0);

	const [commentInput, setCommentInput] = useState('');
	const [editingComments, setEditingComments] = useState<Record<string, string>>({});

	const [searchFilter, setSearchFilter] = useState({
		page: 1,
		limit: 5,
		search: { commentRefId: '' },
	});

	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const { data: articleData, refetch: articleRefetch } = useQuery(GET_BOARD_ARTICLE, {
		variables: { input: articleId },
		skip: !articleId,
		fetchPolicy: 'network-only',
	});

	const { data: commentsData, refetch: commentsRefetch } = useQuery(GET_COMMENTS, {
		variables: { input: searchFilter },
		skip: !searchFilter.search.commentRefId,
		fetchPolicy: 'network-only',
	});

	/* LIFECYCLE */

	useEffect(() => {
		if (articleId) {
			setSearchFilter((prev) => ({
				...prev,
				search: { commentRefId: articleId },
			}));
		}
	}, [articleId]);

	useEffect(() => {
		if (articleData?.getBoardArticle) {
			setBoardArticle(articleData.getBoardArticle);
		}
	}, [articleData]);

	useEffect(() => {
		if (commentsData?.getComments) {
			setComments(commentsData.getComments.list || []);
			setTotal(commentsData.getComments.metaCounter?.[0]?.total || 0);
		}
	}, [commentsData]);

	/* HANDLERS */

	const likeHandler = async () => {
		try {
			if (!user?._id) throw new Error('Please login');

			await likeTargetBoardArticle({
				variables: { input: boardArticle._id },
			});

			await articleRefetch();
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Login required');

			await createComment({
				variables: {
					input: {
						commentGroup: 'BOARD_ARTICLE',
						commentRefId: articleId,
						commentContent: commentInput,
					},
				},
			});

			setCommentInput('');
			await commentsRefetch();
			toastSuccess('Comment added!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const updateCommentHandler = async (id: string, status?: CommentStatus.DELETED) => {
		try {
			if (!user?._id) throw new Error('Login required');

			const confirmed = window.confirm('Are you sure?');
			if (!confirmed) return;

			await updateComment({
				variables: {
					input: {
						_id: id,
						commentContent: editingComments[id],
						commentStatus: status,
					},
				},
			});

			await commentsRefetch();
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const paginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') return <div>MOBILE BLOG DETAIL</div>;

	return (
		<div id="community-detail-page">
			<div className="container">
				{/* Hero like community page */}
				<Stack className="community-hero scroll-reveal">
					<div className="hero-inner">
						<span className="hero-eyebrow">✦ Glowly Community</span>
						<Typography className="hero-title">{boardArticle?.articleTitle}</Typography>
						<Typography className="hero-sub">Shared by {boardArticle?.memberData?.memberNick}</Typography>
					</div>
				</Stack>

				{/* Same card layout as community page */}
				<Stack className="community-card scroll-reveal">
					{/* LEFT SIDEBAR */}
					<Stack className="card-sidebar">
						<div className="sidebar-brand">
							<img src="/img/logo/glowly.svg" />
							<span className="brand-label">Community</span>
						</div>

						<nav className="sidebar-tabs">
							<button className="sidebar-tab-btn">Open Forum</button>
							<button className="sidebar-tab-btn">Recommendations</button>
							<button className="sidebar-tab-btn">Beauty News</button>
							<button className="sidebar-tab-btn">Tutorial</button>
						</nav>
					</Stack>

					{/* RIGHT CONTENT */}
					<Stack className="card-content">
						<div className="article-meta">
							<p>{boardArticle?.memberData?.memberNick}</p>
							<span>{new Date(boardArticle?.createdAt).toLocaleDateString()}</span>
						</div>

						<Typography className="article-content">{boardArticle?.articleContent}</Typography>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(BlogDetail);
