import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
const ToastViewerComponent = dynamic(() => import('../../libs/components/blog/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;
	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({ ...initialInput });
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add('in-view');
				}),
			{ threshold: 0.08 },
		);
		document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [comments, boardArticle]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace({ pathname: '/blog', query: { articleCategory: value } }, '/blog', { shallow: true });
	};

	const creteCommentHandler = async () => {};
	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETED) => {};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const tabs = [
		{ value: 'FREE', label: 'Free Board' },
		{ value: 'RECOMMEND', label: 'Recommendation' },
		{ value: 'NEWS', label: 'News' },
		{ value: 'HUMOR', label: 'Humor' },
	];

	if (device === 'mobile') {
		return (
			<div id="community-detail-page" className="mobile">
				{/* Mobile category pill bar */}
				<div className="mobile-tab-bar">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							className={`mobile-tab-pill ${articleCategory === tab.value ? 'active' : ''}`}
							onClick={(e) => tabChangeHandler(e as any, tab.value)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className="mobile-detail-body">
					{/* Article header */}
					<div className="mobile-article-header scroll-reveal">
						<Typography className="mobile-article-category">{articleCategory} BOARD</Typography>
						<Typography className="mobile-article-title">{boardArticle?.articleTitle}</Typography>

						<div className="mobile-article-meta">
							<img
								src={memberImage}
								alt=""
								className="mobile-member-img"
								onClick={() => goMemberPage(boardArticle?.memberData?._id)}
							/>
							<div className="mobile-meta-info">
								<span className="mobile-member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
									{boardArticle?.memberData?.memberNick}
								</span>
								<Moment className="mobile-time" format="DD MMM YYYY · HH:mm">
									{boardArticle?.createdAt}
								</Moment>
							</div>
							<div className="mobile-stats">
								<span>
									{boardArticle?.meLiked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}{' '}
									{boardArticle?.articleLikes}
								</span>
								<span>
									<VisibilityIcon fontSize="small" /> {boardArticle?.articleViews}
								</span>
								<span>
									<ChatBubbleOutlineRoundedIcon fontSize="small" /> {boardArticle?.articleComments}
								</span>
							</div>
						</div>
					</div>

					{/* Article content */}
					<div className="mobile-article-content scroll-reveal">
						<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
					</div>

					{/* Like button */}
					<div className="mobile-like-section scroll-reveal">
						<button className="mobile-like-btn">
							{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
							<span>{boardArticle?.articleLikes}</span>
						</button>
					</div>

					{/* Comments section */}
					<div className="mobile-comments-section scroll-reveal">
						<Typography className="mobile-comments-heading">Comments ({total})</Typography>
						<div className="mobile-comment-input-box">
							<input
								type="text"
								placeholder="Leave a comment…"
								value={comment}
								onChange={(e) => {
									if (e.target.value.length > 100) return;
									setWordsCnt(e.target.value.length);
									setComment(e.target.value);
								}}
							/>
							<div className="mobile-comment-actions">
								<span className="mobile-word-count">{wordsCnt}/100</span>
								<button className="mobile-comment-submit" onClick={creteCommentHandler}>
									Post
								</button>
							</div>
						</div>

						{comments?.map((commentData, index) => (
							<div
								className="mobile-comment-card scroll-reveal"
								key={commentData?._id}
								style={{ animationDelay: `${index * 60}ms` }}
							>
								<div className="mobile-comment-header">
									<img
										src={getCommentMemberImage(commentData?.memberData?.memberImage)}
										alt=""
										onClick={() => goMemberPage(commentData?.memberData?._id)}
									/>
									<div className="mobile-comment-meta">
										<span className="mobile-comment-name">{commentData?.memberData?.memberNick}</span>
										<Moment className="mobile-comment-date" format="DD MMM · HH:mm">
											{commentData?.createdAt}
										</Moment>
									</div>
									{commentData?.memberId === user?._id && (
										<div className="mobile-comment-btns">
											<IconButton
												size="small"
												onClick={() => updateButtonHandler(commentData?._id, CommentStatus.DELETED)}
											>
												<DeleteForeverIcon sx={{ fontSize: 18, color: '#a08898' }} />
											</IconButton>
											<IconButton
												size="small"
												onClick={() => {
													setUpdatedComment(commentData?.commentContent);
													setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
													setUpdatedCommentId(commentData?._id);
													setOpenBackdrop(true);
												}}
											>
												<EditIcon sx={{ fontSize: 18, color: '#a08898' }} />
											</IconButton>
										</div>
									)}
								</div>
								<Typography className="mobile-comment-body">{commentData?.commentContent}</Typography>
							</div>
						))}

						{total > 0 && (
							<Stack className="mobile-pagination">
								<Pagination
									count={Math.ceil(total / searchFilter.limit) || 1}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
						)}
					</div>
				</div>

				{/* Edit backdrop */}
				<Backdrop sx={{ zIndex: 999, alignItems: 'flex-end' }} open={openBackdrop} onClick={cancelButtonHandler}>
					<Stack className="mobile-edit-sheet" onClick={(e) => e.stopPropagation()}>
						<Typography className="mobile-edit-title">Edit Comment</Typography>
						<input
							autoFocus
							value={updatedComment}
							onChange={(e) => updateCommentInputHandler(e.target.value)}
							type="text"
							className="mobile-edit-input"
						/>
						<div className="mobile-edit-footer">
							<span>{updatedCommentWordsCnt}/100</span>
							<div className="mobile-edit-actions">
								<button className="mobile-edit-cancel" onClick={cancelButtonHandler}>
									Cancel
								</button>
								<button className="mobile-edit-save" onClick={() => updateButtonHandler(updatedCommentId, undefined)}>
									Save
								</button>
							</div>
						</div>
					</Stack>
				</Backdrop>
			</div>
		);
	}

	// PC VERSION
	return (
		<div id="community-detail-page">
			<div className="container">
				<Stack className="main-box">
					<Stack className="left-config scroll-reveal">
						<Stack className={'image-info'}>
							<img src={'/img/logo/logoText.svg'} />
							<Stack className={'community-name'}>
								<Typography className={'name'}>Community Board Article</Typography>
							</Stack>
						</Stack>
						<Tabs
							orientation="vertical"
							aria-label="Community tabs"
							TabIndicatorProps={{ style: { display: 'none' } }}
							onChange={tabChangeHandler}
							value={articleCategory}
						>
							{tabs.map((tab) => (
								<Tab
									key={tab.value}
									value={tab.value}
									label={tab.label}
									className={`tab-button ${articleCategory === tab.value ? 'active' : ''}`}
								/>
							))}
						</Tabs>
					</Stack>

					<div className="community-detail-config">
						<Stack className="title-box scroll-reveal">
							<Stack className="left">
								<Typography className="title">{articleCategory} BOARD</Typography>
								<Typography className="sub-title">
									Share your thoughts and experiences freely—no content restrictions.
								</Typography>
							</Stack>
							<Button
								className="right"
								onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
							>
								Write
							</Button>
						</Stack>

						<div className="config">
							<Stack className="first-box-config scroll-reveal">
								<Stack className="content-and-info">
									<Stack className="content">
										<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
										<Stack className="member-info">
											<img
												src={memberImage}
												alt=""
												className="member-img"
												onClick={() => goMemberPage(boardArticle?.memberData?._id)}
											/>
											<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
												{boardArticle?.memberData?.memberNick}
											</Typography>
											<Stack className="divider" />
											<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
												{boardArticle?.createdAt}
											</Moment>
										</Stack>
									</Stack>
									<Stack className="info">
										<Stack className="icon-info">
											{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
											<Typography className="text">{boardArticle?.articleLikes}</Typography>
										</Stack>
										<Stack className="divider" />
										<Stack className="icon-info">
											<VisibilityIcon />
											<Typography className="text">{boardArticle?.articleViews}</Typography>
										</Stack>
										<Stack className="divider" />
										<Stack className="icon-info">
											{boardArticle?.articleComments && boardArticle?.articleComments > 0 ? (
												<ChatIcon />
											) : (
												<ChatBubbleOutlineRoundedIcon />
											)}
											<Typography className="text">{boardArticle?.articleComments}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack>
									<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
								</Stack>
								<Stack className="like-and-dislike">
									<Stack className="top">
										<Button>
											{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
											<Typography className="text">{boardArticle?.articleLikes}</Typography>
										</Button>
									</Stack>
								</Stack>
							</Stack>

							<Stack
								className="second-box-config scroll-reveal"
								sx={{ borderBottom: total > 0 ? 'none' : '1px solid #f0e0ea', border: '1px solid #f0e0ea' }}
							>
								<Typography className="title-text">Comments ({total})</Typography>
								<Stack className="leave-comment">
									<input
										type="text"
										placeholder="Leave a comment"
										value={comment}
										onChange={(e) => {
											if (e.target.value.length > 100) return;
											setWordsCnt(e.target.value.length);
											setComment(e.target.value);
										}}
									/>
									<Stack className="button-box">
										<Typography>{wordsCnt}/100</Typography>
										<Button onClick={creteCommentHandler}>comment</Button>
									</Stack>
								</Stack>
							</Stack>

							{total > 0 && (
								<Stack className="comments">
									<Typography className="comments-title">Comments</Typography>
								</Stack>
							)}

							{comments?.map((commentData, index) => (
								<Stack
									className="comments-box scroll-reveal"
									key={commentData?._id}
									style={{ animationDelay: `${index * 60}ms` } as any}
								>
									<Stack className="main-comment">
										<Stack className="member-info">
											<Stack className="name-date" onClick={() => goMemberPage(commentData?.memberData?._id as string)}>
												<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
												<Stack className="name-date-column">
													<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
													<Typography className="date">
														<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
															{commentData?.createdAt}
														</Moment>
													</Typography>
												</Stack>
											</Stack>
											{commentData?.memberId === user?._id && (
												<Stack className="buttons">
													<IconButton
														onClick={() => {
															setUpdatedCommentId(commentData?._id);
															updateButtonHandler(commentData?._id, CommentStatus.DELETED);
														}}
													>
														<DeleteForeverIcon sx={{ color: '#a08898', cursor: 'pointer' }} />
													</IconButton>
													<IconButton
														onClick={() => {
															setUpdatedComment(commentData?.commentContent);
															setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
															setUpdatedCommentId(commentData?._id);
															setOpenBackdrop(true);
														}}
													>
														<EditIcon sx={{ color: '#a08898' }} />
													</IconButton>
													<Backdrop
														sx={{
															top: '40%',
															right: '25%',
															left: '25%',
															width: '1000px',
															height: 'fit-content',
															borderRadius: '10px',
															color: '#ffffff',
															zIndex: 999,
														}}
														open={openBackdrop}
													>
														<Stack
															sx={{
																width: '100%',
																height: '100%',
																background: 'white',
																border: '1px solid #f0e0ea',
																padding: '20px',
																gap: '12px',
																borderRadius: '10px',
																boxShadow: '0 8px 32px rgba(245,100,169,0.12)',
															}}
														>
															<Typography variant="h4" color={'#5c4556'}>
																Update comment
															</Typography>
															<Stack gap={'16px'}>
																<input
																	autoFocus
																	value={updatedComment}
																	onChange={(e) => updateCommentInputHandler(e.target.value)}
																	type="text"
																	style={{
																		border: '1px solid #f0e0ea',
																		outline: 'none',
																		height: '44px',
																		padding: '0 12px',
																		borderRadius: '6px',
																		fontFamily: 'DM Sans, sans-serif',
																	}}
																/>
																<Stack
																	width={'100%'}
																	flexDirection={'row'}
																	justifyContent={'space-between'}
																	alignItems="center"
																>
																	<Typography variant="subtitle1" color={'#a08898'}>
																		{updatedCommentWordsCnt}/100
																	</Typography>
																	<Stack sx={{ flexDirection: 'row', gap: '10px' }}>
																		<Button
																			variant="outlined"
																			color="inherit"
																			onClick={cancelButtonHandler}
																			sx={{ borderColor: '#f0e0ea', color: '#5c4556' }}
																		>
																			Cancel
																		</Button>
																		<Button
																			variant="contained"
																			onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																			sx={{ background: '#F564A9', '&:hover': { background: '#d94d92' } }}
																		>
																			Update
																		</Button>
																	</Stack>
																</Stack>
															</Stack>
														</Stack>
													</Backdrop>
												</Stack>
											)}
										</Stack>
										<Stack className="content">
											<Typography>{commentData?.commentContent}</Typography>
										</Stack>
									</Stack>
								</Stack>
							))}

							{total > 0 && (
								<Stack className="pagination-box scroll-reveal">
									<Pagination
										count={Math.ceil(total / searchFilter.limit) || 1}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
							)}
						</div>
					</div>
				</Stack>
			</div>
		</div>
	);
};

CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
