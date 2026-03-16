import React, { useRef, useState } from 'react';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Message } from '../../enums/common.enum';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { toastError, toastSuccess } from '../../toast';

const CATEGORIES = [
	{ value: BoardArticleCategory.FREE, label: 'Free Talk' },
	{ value: BoardArticleCategory.TUTORIAL, label: 'Tutorial' },
	{ value: BoardArticleCategory.NEWS, label: 'News' },
	{ value: BoardArticleCategory.RECOMMEND, label: 'Recommendation' },
	{ value: BoardArticleCategory.REVIEW, label: 'Review' },
	{ value: BoardArticleCategory.QUESTION, label: 'Q&A' },
	{ value: BoardArticleCategory.DISCUSSION, label: 'Discussion' },
];

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null);
	const token = getJwtToken();
	const router = useRouter();

	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);
	const [articleTitle, setArticleTitle] = useState('');
	const [articleImage, setArticleImage] = useState('');
	const [publishing, setPublishing] = useState(false);
	const [hasContent, setHasContent] = useState(false);

	const [createboardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
					}`,
					variables: { file: null, target: 'article' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			setArticleImage(responseImage);
			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const handleRegisterButton = async () => {
		try {
			setPublishing(true);
			const articleContent = editorRef.current?.getInstance().getHTML() as string;
			await createboardArticle({
				variables: {
					input: { articleTitle, articleContent, articleImage, articleCategory },
				},
			});
			toastSuccess('Article published successfully!');
			await router.push({ pathname: '/mypage', query: { category: 'myArticles' } });
		} catch (err: any) {
			toastError(err?.message ?? Message.SOMETHING_WENT_WRONG);
		} finally {
			setPublishing(false);
		}
	};

	const doDisabledCheck = () => !articleTitle.trim() || !hasContent;

	return (
		<div className="tui-editor-wrap">
			{/* ── Top controls ─────────────────────────── */}
			<div className="tui-controls">
				<div className="tui-field">
					<label className="tui-label">Category</label>
					<div className="tui-select-wrap">
						<select
							className="tui-select"
							value={articleCategory}
							onChange={(e) => setArticleCategory(e.target.value as BoardArticleCategory)}
						>
							{CATEGORIES.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
						<svg className="tui-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M6 9l6 6 6-6" />
						</svg>
					</div>
				</div>

				<div className="tui-field tui-field-title">
					<label className="tui-label">Article Title *</label>
					<input
						type="text"
						className="tui-input"
						placeholder="Enter a clear and descriptive title..."
						value={articleTitle}
						onChange={(e) => setArticleTitle(e.target.value)}
					/>
				</div>
			</div>

			{/* ── Editor ───────────────────────────────── */}
			<div className="tui-editor-box">
				<Editor
					initialValue=" "
					placeholder="Start writing..."
					previewStyle="tab"
					height="520px"
					initialEditType="wysiwyg"
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					onChange={() => {
						const content = editorRef.current?.getInstance().getHTML() || '';
						setHasContent(content !== '<p><br></p>' && content !== '' && content.trim() !== '<p></p>');
					}}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const url = await uploadImage(image);
							callback(url);
							return false;
						},
					}}
					events={{ load: () => {} }}
				/>
			</div>

			{/* ── Footer / publish bar ─────────────────── */}
			<div className="tui-footer">
				<div className="tui-footer-hint">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					Fill in the title and content to publish
				</div>
				<button className="tui-publish-btn" onClick={handleRegisterButton} disabled={doDisabledCheck() || publishing}>
					{publishing ? (
						<span className="tui-spinner" />
					) : (
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="22" y1="2" x2="11" y2="13" />
							<polygon points="22 2 15 22 11 13 2 9 22 2" />
						</svg>
					)}
					{publishing ? 'Publishing...' : 'Publish Article'}
				</button>
			</div>
		</div>
	);
};

export default TuiEditor;
