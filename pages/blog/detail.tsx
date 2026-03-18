import React, { useEffect, useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Stack, Pagination } from '@mui/material';

import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { userVar } from '../../apollo/store';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, UPDATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { toastError, toastSuccess } from '@/libs/toast';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// ✅ getStaticProps instead of getServerSideProps — no params needed since we use query strings
export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const categoryMeta: Record<string, { icon: string; label: string }> = {
	FREE: { icon: '✦', label: 'Open Forum' },
	RECOMMEND: { icon: '♡', label: 'Recommendations' },
	NEWS: { icon: '◎', label: 'Beauty News' },
	TUTORIAL: { icon: '✿', label: 'Lighthearted' },
};

const BlogDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// ✅ Read both from query params: /blog/detail?articleCategory=FREE&id=...
	const articleId = (router.query.id as string) || '';
	const articleCategory = (router.query.articleCategory as string) || 'FREE';

	const [boardArticle, setBoardArticle] = useState<any>(null);
	const [comments, setComments] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [commentInput, setCommentInput] = useState('');
	const [editingComments, setEditingComments] = useState<Record<string, string>>({});
	const [searchFilter, setSearchFilter] = useState({
		page: 1,
		limit: 5,
		search: { commentRefId: articleId },
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

	useEffect(() => {
		if (articleId) setSearchFilter((prev) => ({ ...prev, search: { commentRefId: articleId } }));
	}, [articleId]);

	useEffect(() => {
		if (articleData?.getBoardArticle) setBoardArticle(articleData.getBoardArticle);
	}, [articleData]);

	useEffect(() => {
		if (commentsData?.getComments) {
			setComments(commentsData.getComments.list || []);
			setTotal(commentsData.getComments.metaCounter?.[0]?.total || 0);
		}
	}, [commentsData]);

	const likeHandler = async () => {
		try {
			if (!user?._id) throw new Error('Please login');
			await likeTargetBoardArticle({ variables: { input: boardArticle._id } });
			await articleRefetch();
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Login required');
			if (!commentInput.trim()) return;
			if (user._id === boardArticle?.memberId) throw new Error("You can't comment on your own article");
			await createComment({
				variables: { input: { commentGroup: 'ARTICLE', commentRefId: articleId, commentContent: commentInput } },
			});
			setCommentInput('');
			await commentsRefetch();
			toastSuccess('Comment added!');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const updateCommentHandler = async (id: string, status?: CommentStatus) => {
		try {
			if (!user?._id) throw new Error('Login required');
			if (!window.confirm('Are you sure?')) return;
			await updateComment({
				variables: { input: { _id: id, commentContent: editingComments[id], commentStatus: status } },
			});
			await commentsRefetch();
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const paginationHandler = (e: ChangeEvent<unknown>, value: number) =>
		setSearchFilter({ ...searchFilter, page: value });

	if (device === 'mobile') return <div>MOBILE BLOG DETAIL</div>;

	// ✅ Use category from URL query param first, fallback to fetched article's category
	const cat = boardArticle?.articleCategory || articleCategory || 'FREE';
	const catMeta = categoryMeta[cat] ?? categoryMeta['FREE'];

	const isLiked: boolean = Array.isArray(boardArticle?.meLiked) && boardArticle.meLiked.length > 0;
	const likeCount: number = boardArticle?.articleLikes ?? 0;

	return (
		<div
			id="community-detail-page"
			style={{
				position: 'relative',
				zIndex: 1,
				background: '#fff',
				color: '#1a1a1a',
				minHeight: '100vh',
				width: '100%',
			}}
		>
			<div
				style={{
					maxWidth: 1100,
					margin: '0 auto',
					padding: '48px 40px 80px',
					display: 'flex',
					flexDirection: 'column',
					gap: 32,
				}}
			>
				{/* ── Hero ── */}
				<div style={{ padding: '48px 0 24px', borderBottom: '1px solid #f0ebe4' }}>
					<span
						style={{ fontSize: 11, color: '#f564a9', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }}
					>
						✦ Glowly Community
					</span>
					<h1
						style={{
							fontFamily: 'Cormorant Garamond, serif',
							fontSize: 'clamp(32px, 5vw, 58px)',
							fontWeight: 400,
							color: '#2a2520',
							margin: '10px 0 8px',
							lineHeight: 1.1,
						}}
					>
						{boardArticle?.articleTitle || 'Loading…'}
					</h1>
					<p style={{ fontFamily: 'Jost, sans-serif', fontSize: 13, color: '#7a7067', fontWeight: 300, margin: 0 }}>
						{catMeta.label}
					</p>
				</div>

				{/* ── Two panel ── */}
				<div
					style={{
						display: 'flex',
						border: '1px solid #f0ebe4',
						borderRadius: 8,
						overflow: 'hidden',
						background: '#fff',
						boxShadow: '0 4px 24px rgba(42,37,32,0.07)',
					}}
				>
					{/* Sidebar */}
					<div
						style={{
							width: 220,
							flexShrink: 0,
							borderRight: '1px solid #f0ebe4',
							background: '#fdfcfb',
							padding: '28px 0 32px',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '0 20px 20px',
								borderBottom: '1px solid #f0ebe4',
								marginBottom: 12,
							}}
						>
							<img
								src="/img/logo/glowly.svg"
								alt="Glowly"
								style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
							/>
							<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: '#2a2520' }}>Community</span>
						</div>
						<nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
							{Object.entries(categoryMeta).map(([value, { icon, label }]) => (
								<button
									key={value}
									onClick={() => router.push({ pathname: '/blog', query: { articleCategory: value } })}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 9,
										width: '100%',
										height: 40,
										padding: '0 12px',
										border: cat === value ? '1px solid rgba(245,100,169,0.18)' : '1px solid transparent',
										borderRadius: 4,
										background: cat === value ? 'rgba(245,100,169,0.07)' : 'transparent',
										cursor: 'pointer',
										textAlign: 'left',
									}}
								>
									<span style={{ fontSize: 11, color: '#f564a9', opacity: cat === value ? 1 : 0.4 }}>{icon}</span>
									<span
										style={{
											fontFamily: 'Jost, sans-serif',
											fontSize: 13,
											color: cat === value ? '#2a2520' : '#7a7067',
											fontWeight: cat === value ? 500 : 400,
										}}
									>
										{label}
									</span>
								</button>
							))}
						</nav>
						<div style={{ marginTop: 'auto', padding: '20px 20px 0' }}>
							<div style={{ height: 1, background: '#f0ebe4', marginBottom: 14 }} />
							<p
								style={{
									fontFamily: 'Cormorant Garamond, serif',
									fontSize: 11.5,
									fontStyle: 'italic',
									fontWeight: 300,
									color: 'rgba(122,112,103,0.5)',
									lineHeight: 1.6,
									margin: 0,
								}}
							>
								Respectful conversation is always welcome here.
							</p>
						</div>
					</div>

					{/* Content area */}
					<div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
						{/* Header */}
						<div
							style={{
								padding: '24px 32px 20px',
								borderBottom: '1px solid #f0ebe4',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
							}}
						>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
								<span
									style={{
										fontFamily: 'Jost, sans-serif',
										fontSize: 9,
										letterSpacing: '0.22em',
										textTransform: 'uppercase',
										color: '#f564a9',
										fontWeight: 500,
									}}
								>
									{cat} BOARD
								</span>
								<span
									style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 400, color: '#2a2520' }}
								>
									{catMeta.label}
								</span>
								{boardArticle && (
									<span style={{ fontFamily: 'Jost, sans-serif', fontSize: 12, color: '#7a7067', fontWeight: 300 }}>
										By {boardArticle?.memberData?.memberNick || 'Anonymous'} ·{' '}
										{new Date(boardArticle.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</span>
								)}
							</div>
							<button
								onClick={() => router.push({ pathname: '/blog', query: { articleCategory: cat } })}
								style={{
									height: 36,
									padding: '0 18px',
									background: '#f564a9',
									color: '#fff',
									border: 'none',
									borderRadius: 4,
									fontFamily: 'Jost, sans-serif',
									fontSize: 11,
									fontWeight: 500,
									letterSpacing: '0.1em',
									textTransform: 'uppercase',
									cursor: 'pointer',
									flexShrink: 0,
								}}
							>
								← Back
							</button>
						</div>

						{/* Article content */}
						<div style={{ padding: '32px 32px 24px', flex: 1 }}>
							{!boardArticle ? (
								<p style={{ color: '#7a7067', fontFamily: 'Jost, sans-serif', fontSize: 14 }}>Loading article…</p>
							) : (
								<>
									{boardArticle?.articleImage && (
										<img
											src={boardArticle.articleImage}
											alt={boardArticle.articleTitle}
											style={{
												width: '100%',
												maxHeight: 420,
												objectFit: 'cover',
												borderRadius: 8,
												marginBottom: 24,
												display: 'block',
											}}
										/>
									)}

									<div
										style={{
											fontFamily: 'Cormorant Garamond, serif',
											fontSize: 17,
											lineHeight: 1.75,
											color: '#2a2520',
										}}
										dangerouslySetInnerHTML={{ __html: boardArticle?.articleContent || '' }}
									/>

									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 16,
											marginTop: 32,
											paddingTop: 20,
											borderTop: '1px solid #f0ebe4',
										}}
									>
										<button
											onClick={likeHandler}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 6,
												height: 34,
												padding: '0 18px',
												background: isLiked ? '#f564a9' : 'transparent',
												border: '1px solid rgba(245,100,169,0.5)',
												borderRadius: 20,
												color: isLiked ? '#fff' : '#f564a9',
												fontFamily: 'Jost, sans-serif',
												fontSize: 13,
												fontWeight: 500,
												cursor: 'pointer',
												transition: 'all 0.2s ease',
											}}
										>
											{isLiked ? '♥' : '♡'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
										</button>
										<span style={{ fontFamily: 'Jost, sans-serif', fontSize: 13, color: '#7a7067' }}>
											◎ {boardArticle?.articleViews ?? 0} views
										</span>
									</div>
								</>
							)}
						</div>

						{/* Comments */}
						<div
							style={{
								padding: '24px 32px 36px',
								borderTop: '1px solid #f0ebe4',
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
							}}
						>
							<h2
								style={{
									fontFamily: 'Cormorant Garamond, serif',
									fontSize: 22,
									fontWeight: 400,
									color: '#2a2520',
									margin: 0,
								}}
							>
								Comments ({total})
							</h2>

							{user?._id && user._id !== boardArticle?.memberId ? (
								<div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
									<textarea
										placeholder="Share your thoughts…"
										value={commentInput}
										onChange={(e) => setCommentInput(e.target.value)}
										rows={3}
										style={{
											flex: 1,
											border: '1px solid #f0ebe4',
											borderRadius: 6,
											padding: '12px 14px',
											fontFamily: 'Jost, sans-serif',
											fontSize: 13,
											color: '#2a2520',
											resize: 'vertical',
											outline: 'none',
											background: '#faf9f7',
										}}
									/>
									<button
										onClick={createCommentHandler}
										style={{
											height: 44,
											padding: '0 20px',
											background: '#f564a9',
											color: '#fff',
											border: 'none',
											borderRadius: 4,
											fontFamily: 'Jost, sans-serif',
											fontSize: 12,
											fontWeight: 500,
											letterSpacing: '0.05em',
											textTransform: 'uppercase',
											cursor: 'pointer',
											whiteSpace: 'nowrap',
										}}
									>
										Post
									</button>
								</div>
							) : (
								<p style={{ fontFamily: 'Jost, sans-serif', fontSize: 13, color: '#7a7067', margin: 0 }}>
									{user?._id ? 'You cannot comment on your own article.' : 'Please log in to leave a comment.'}
								</p>
							)}

							<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
								{comments.length === 0 ? (
									<p
										style={{
											fontFamily: 'Cormorant Garamond, serif',
											fontSize: 15,
											fontStyle: 'italic',
											color: '#7a7067',
											textAlign: 'center',
											padding: '20px 0',
											margin: 0,
										}}
									>
										No comments yet. Be the first!
									</p>
								) : (
									comments.map((comment) => (
										<div
											key={comment._id}
											style={{
												background: '#faf9f7',
												border: '1px solid #f0ebe4',
												borderRadius: 6,
												padding: '14px 16px',
												display: 'flex',
												flexDirection: 'column',
												gap: 8,
											}}
										>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<span
													style={{ fontFamily: 'Jost, sans-serif', fontSize: 13, fontWeight: 600, color: '#2a2520' }}
												>
													{comment?.memberData?.memberNick || 'Anonymous'}
												</span>
												<span style={{ fontFamily: 'Jost, sans-serif', fontSize: 11, color: 'rgba(122,112,103,0.7)' }}>
													{new Date(comment.createdAt).toLocaleDateString()}
												</span>
											</div>

											{editingComments[comment._id] !== undefined ? (
												<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
													<textarea
														value={editingComments[comment._id]}
														onChange={(e) => setEditingComments((prev) => ({ ...prev, [comment._id]: e.target.value }))}
														rows={2}
														style={{
															border: '1px solid #f0ebe4',
															borderRadius: 6,
															padding: '8px 12px',
															fontFamily: 'Jost, sans-serif',
															fontSize: 13,
															color: '#2a2520',
															resize: 'vertical',
															outline: 'none',
															background: '#fff',
														}}
													/>
													<div style={{ display: 'flex', gap: 8 }}>
														<button
															onClick={() => updateCommentHandler(comment._id)}
															style={{
																padding: '4px 14px',
																background: '#f564a9',
																color: '#fff',
																border: 'none',
																borderRadius: 4,
																fontSize: 12,
																cursor: 'pointer',
															}}
														>
															Save
														</button>
														<button
															onClick={() =>
																setEditingComments((prev) => {
																	const n = { ...prev };
																	delete n[comment._id];
																	return n;
																})
															}
															style={{
																padding: '4px 14px',
																background: '#eee',
																color: '#555',
																border: 'none',
																borderRadius: 4,
																fontSize: 12,
																cursor: 'pointer',
															}}
														>
															Cancel
														</button>
													</div>
												</div>
											) : (
												<>
													<p
														style={{
															fontFamily: 'Jost, sans-serif',
															fontSize: 13.5,
															lineHeight: 1.65,
															color: '#2a2520',
															margin: 0,
														}}
													>
														{comment.commentContent}
													</p>
													{user?._id === comment?.memberData?._id && (
														<div style={{ display: 'flex', gap: 8 }}>
															<button
																onClick={() =>
																	setEditingComments((prev) => ({ ...prev, [comment._id]: comment.commentContent }))
																}
																style={{
																	padding: '3px 12px',
																	background: 'none',
																	border: '1px solid #ddd',
																	borderRadius: 4,
																	fontSize: 12,
																	color: '#555',
																	cursor: 'pointer',
																}}
															>
																Edit
															</button>
															<button
																onClick={() => updateCommentHandler(comment._id, CommentStatus.DELETED)}
																style={{
																	padding: '3px 12px',
																	background: 'none',
																	border: '1px solid #ffcccc',
																	borderRadius: 4,
																	fontSize: 12,
																	color: '#e57373',
																	cursor: 'pointer',
																}}
															>
																Delete
															</button>
														</div>
													)}
												</>
											)}
										</div>
									))
								)}
							</div>

							{total > searchFilter.limit && (
								<Stack alignItems="center" mt={2}>
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(BlogDetail);
