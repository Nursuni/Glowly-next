import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tabs, Tab, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
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

const tabs = [
	{ value: 'FREE', label: 'Open Forum', icon: '✦' },
	{ value: 'RECOMMEND', label: 'Recommendations', icon: '♡' },
	{ value: 'NEWS', label: 'Beauty News', icon: '◎' },
	{ value: 'HUMOR', label: 'Lighthearted', icon: '✿' },
];

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
	const getCommentMemberImage = (imageUrl: string | undefined) =>
		imageUrl ? `${process.env.REACT_APP_API_URL}/${imageUrl}` : '/img/community/articleImg.png';
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
	const paginationHandler = (e: T, value: number) => setSearchFilter({ ...searchFilter, page: value });

	if (device === 'mobile') {
		return (
			<div id="community-detail-page" className="mobile">
				<div className="mobile-tab-bar">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							className={`mobile-tab-pill ${articleCategory === tab.value ? 'active' : ''}`}
							onClick={(e) => tabChangeHandler(e as any, tab.value)}
						>
							<span className="pill-icon">{tab.icon}</span>
							{tab.label}
						</button>
					))}
				</div>

				<div className="mobile-detail-body">
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
								<span className="mobile-time">{dayjs(boardArticle?.createdAt).format('DD MMM YYYY · HH:mm')}</span>
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

					<div className="mobile-article-content scroll-reveal">
						<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
					</div>

					<div className="mobile-like-section scroll-reveal">
						<button className="mobile-like-btn">
							{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
							<span>{boardArticle?.articleLikes} found this helpful</span>
						</button>
					</div>

					<div className="mobile-comments-section scroll-reveal">
						<Typography className="mobile-comments-heading">
							{total > 0 ? `${total} Responses` : 'Start the Conversation'}
						</Typography>
						<div className="mobile-comment-input-box">
							<input
								type="text"
								placeholder="Share your thoughts…"
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
										<span className="mobile-comment-date">
											{dayjs(commentData?.createdAt).format('DD MMM · HH:mm')}
										</span>
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

				<Backdrop sx={{ zIndex: 999, alignItems: 'flex-end' }} open={openBackdrop} onClick={cancelButtonHandler}>
					<Stack className="mobile-edit-sheet" onClick={(e) => e.stopPropagation()}>
						<Typography className="mobile-edit-title">Edit Your Response</Typography>
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
									Discard
								</button>
								<button className="mobile-edit-save" onClick={() => updateButtonHandler(updatedCommentId, undefined)}>
									Save Changes
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
					{/* ── Sidebar ── */}
					<Stack className="left-config scroll-reveal">
						<Stack className="image-info">
							<img src={'/img/logo/glowly.svg'} alt="Glowly" />
							<Stack className="community-name">
								<span className="name-eyebrow">✦ Community</span>
								<Typography className="name">Article</Typography>
								<Typography className="name-sub">Thoughtful writing, shared with care.</Typography>
							</Stack>
						</Stack>

						<Tabs
							orientation="vertical"
							aria-label="Community categories"
							TabIndicatorProps={{ style: { display: 'none' } }}
							onChange={tabChangeHandler}
							value={articleCategory}
						>
							{tabs.map((tab) => (
								<Tab
									key={tab.value}
									value={tab.value}
									label={
										<span className="tab-label-inner">
											<span className="tab-icon">{tab.icon}</span>
											{tab.label}
										</span>
									}
									className={`tab-button ${articleCategory === tab.value ? 'active' : ''}`}
								/>
							))}
						</Tabs>

						<div className="sidebar-divider" />
						<Typography className="sidebar-note">Every voice matters here. Write with kindness.</Typography>
					</Stack>

					{/* ── Article Area ── */}
					<div className="community-detail-config">
						<Stack className="title-box scroll-reveal">
							<Stack className="left">
								<span className="title-eyebrow">{articleCategory} BOARD</span>
								<Typography className="title">Reading an Article</Typography>
								<Typography className="sub-title">
									Share your perspective in the comments below — all thoughtful voices are welcome.
								</Typography>
							</Stack>
							<Button
								className="write-btn"
								onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
							>
								✦ Compose
							</Button>
						</Stack>

						<div className="config">
							{/* Article Card */}
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
											<Typography className="time-added">
												{dayjs(boardArticle?.createdAt).format('DD MMM YYYY · HH:mm')}
											</Typography>
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

								<Stack className="article-body">
									<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
								</Stack>

								<Stack className="like-and-dislike">
									<Stack className="top">
										<Button className="like-btn">
											{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
											<Typography className="text">{boardArticle?.articleLikes} found this helpful</Typography>
										</Button>
									</Stack>
								</Stack>
							</Stack>

							{/* Comment Input */}
							<Stack className="second-box-config scroll-reveal">
								<Typography className="title-text">
									{total > 0 ? `${total} Responses` : 'Start the Conversation'}
								</Typography>
								<Stack className="leave-comment">
									<input
										type="text"
										placeholder="Share your thoughts with the community…"
										value={comment}
										onChange={(e) => {
											if (e.target.value.length > 100) return;
											setWordsCnt(e.target.value.length);
											setComment(e.target.value);
										}}
									/>
									<Stack className="button-box">
										<Typography>{wordsCnt}/100</Typography>
										<Button onClick={creteCommentHandler}>Post Response</Button>
									</Stack>
								</Stack>
							</Stack>

							{/* Comments header */}
							{total > 0 && (
								<Stack className="comments">
									<Typography className="comments-title">Responses</Typography>
								</Stack>
							)}

							{/* Comment list */}
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
														{dayjs(commentData?.createdAt).format('DD MMM YYYY · HH:mm')}
													</Typography>
												</Stack>
											</Stack>

											{commentData?.memberId === user?._id && (
												<Stack className="buttons">
													<IconButton
														title="Remove this response"
														onClick={() => {
															setUpdatedCommentId(commentData?._id);
															updateButtonHandler(commentData?._id, CommentStatus.DELETED);
														}}
													>
														<DeleteForeverIcon sx={{ color: '#a08898' }} />
													</IconButton>
													<IconButton
														title="Edit your response"
														onClick={() => {
															setUpdatedComment(commentData?.commentContent);
															setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
															setUpdatedCommentId(commentData?._id);
															setOpenBackdrop(true);
														}}
													>
														<EditIcon sx={{ color: '#a08898' }} />
													</IconButton>

													{/* Edit Backdrop */}
													<Backdrop
														sx={{
															top: '40%',
															right: '25%',
															left: '25%',
															width: '800px',
															height: 'fit-content',
															borderRadius: '10px',
															zIndex: 999,
														}}
														open={openBackdrop}
													>
														<Stack
															sx={{
																width: '100%',
																background: '#fff',
																border: '1px solid #f0e0ea',
																padding: '28px',
																gap: '16px',
																borderRadius: '10px',
																boxShadow: '0 8px 40px rgba(245,100,169,0.14)',
															}}
														>
															<Typography
																variant="h5"
																sx={{ fontFamily: "'Cormorant Garamond', serif", color: '#2a2520', fontWeight: 400 }}
															>
																Edit Your Response
															</Typography>
															<input
																autoFocus
																value={updatedComment}
																onChange={(e) => updateCommentInputHandler(e.target.value)}
																type="text"
																style={{
																	border: '1px solid #f0e0ea',
																	outline: 'none',
																	height: '48px',
																	padding: '0 14px',
																	borderRadius: '4px',
																	fontFamily: "'Jost', sans-serif",
																	fontSize: '14px',
																	color: '#2a2520',
																	width: '100%',
																}}
																placeholder="Refine your thoughts…"
															/>
															<Stack flexDirection="row" justifyContent="space-between" alignItems="center">
																<Typography
																	sx={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: '#a08898' }}
																>
																	{updatedCommentWordsCnt}/100 characters
																</Typography>
																<Stack flexDirection="row" gap="10px">
																	<Button
																		variant="outlined"
																		onClick={cancelButtonHandler}
																		sx={{
																			borderColor: '#f0e0ea',
																			color: '#7a7067',
																			fontFamily: "'Jost', sans-serif",
																			textTransform: 'none',
																			fontSize: '13px',
																			borderRadius: '3px',
																		}}
																	>
																		Discard
																	</Button>
																	<Button
																		variant="contained"
																		onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																		sx={{
																			background: '#f564a9',
																			fontFamily: "'Jost', sans-serif",
																			textTransform: 'none',
																			fontSize: '13px',
																			borderRadius: '3px',
																			'&:hover': { background: '#d94d92' },
																		}}
																	>
																		Save Changes
																	</Button>
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
