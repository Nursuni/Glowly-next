import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductBigCard from '../../libs/components/common/ProductBigCard';
import ReviewCard from '@/libs/components/brand/ReviewCard';

import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';

import { Product } from '../../libs/types/product/product';
import { Member } from '../../libs/types/member/member';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';

import { CommentGroup } from '../../libs/enums/comment.enum';
import { userVar } from '../../apollo/store';

import { GET_MEMBER, GET_PRODUCTS, GET_COMMENTS } from '@/apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT } from '@/apollo/user/mutation';
import { NEXT_PUBLIC_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toastError, toastSuccess } from '@/libs/toast';
import { Direction } from '@/libs/enums/common.enum';

export const getServerSideProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const BrandDetail: NextPage = ({ initialInput, initialComment }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [brandId, setBrandId] = useState<string | null>(null);
	const [brand, setBrand] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const [brandProducts, setBrandProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [brandComments, setBrandComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);

	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	/* ================= ROUTER ================= */
	useEffect(() => {
		if (router.isReady && router.query.brandId) {
			setBrandId(router.query.brandId as string);
		}
	}, [router.isReady, router.query.brandId]);

	/* ================= GET MEMBER ================= */
	const { data: memberData } = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: brandId },
		skip: !brandId,
	});

	useEffect(() => {
		const member = memberData?.getMember;
		if (!member) return;

		setBrand(member);

		setSearchFilter((prev) => ({
			...prev,
			search: { memberId: member._id },
		}));

		setCommentInquiry((prev) => ({
			...prev,
			search: { commentRefId: member._id },
		}));

		setInsertCommentData((prev) => ({
			...prev,
			commentRefId: member._id,
		}));
	}, [memberData]);

	/* ================= GET PRODUCTS ================= */
	const { data: productsData, refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
	});

	useEffect(() => {
		if (productsData?.getProducts) {
			setBrandProducts(productsData.getProducts.list || []);
			setProductTotal(productsData.getProducts.metaCounter?.[0]?.total || 0);
		}
	}, [productsData]);

	useEffect(() => {
		if (searchFilter?.search?.memberId) {
			getProductsRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/* ================= GET COMMENTS ================= */
	const { data: commentsData, refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: commentInquiry },
		skip: !commentInquiry?.search?.commentRefId,
	});

	useEffect(() => {
		if (commentsData?.getComments) {
			setBrandComments(commentsData.getComments.list || []);
			setCommentTotal(commentsData.getComments.metaCounter?.[0]?.total || 0);
		}
	}, [commentsData]);

	useEffect(() => {
		if (commentInquiry?.search?.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/* ================= HANDLERS ================= */
	const productPaginationChangeHandler = (_: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const commentPaginationChangeHandler = (_: ChangeEvent<unknown>, value: number) => {
		setCommentInquiry({ ...commentInquiry, page: value });
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Login required');
			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
			toastSuccess('Review added');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	const likeProductHandler = async (productId: string) => {
		try {
			if (!user?._id) throw new Error('Login required');
			await likeTargetProduct({ variables: { input: productId } });
			await getProductsRefetch({ input: searchFilter });
			toastSuccess('Liked');
		} catch (err: any) {
			toastError(err.message);
		}
	};

	if (device === 'mobile') return <div>Mobile</div>;

	return (
		<Stack className="brand-detail-page">
			<Stack className="container">
				{/* ── BRAND HERO ── */}
				<Stack className="brand-hero">
					<div className="brand-hero__bg" />
					<Stack className="brand-info" onClick={() => brand?._id && router.push(`/member?memberId=${brand._id}`)}>
						<div className="brand-avatar-wrap">
							<img
								src={brand?.memberImage ? `${NEXT_PUBLIC_API_URL}/${brand.memberImage}` : '/img/profile/user.svg'}
								alt={brand?.memberNick || 'Brand'}
							/>
						</div>
						<div className="info">
							<strong>{brand?.memberNick ?? '—'}</strong>
							<div>
								<span>{brand?.memberAddress ?? ''}</span>
							</div>
							<div className="meta-row">
								<span className="meta-pill">{productTotal} products</span>
								<span className="meta-pill">{commentTotal} reviews</span>
							</div>
						</div>
					</Stack>
				</Stack>

				{/* ── PRODUCTS ── */}
				<Stack className="brand-home-list">
					<Typography className="section-title">Collection</Typography>

					{brandProducts.length === 0 ? (
						<Stack className="empty-state">
							<img src="/img/icons/icoAlert.svg" alt="no products" />
							<Typography>No products from this brand yet.</Typography>
						</Stack>
					) : (
						<div className="card-wrap">
							<div className="wrap-main">
								{brandProducts.map((p) => (
									<ProductBigCard key={p._id} product={p} likeProductHandler={() => likeProductHandler(p._id)} />
								))}
							</div>
						</div>
					)}

					{brandProducts.length > 0 && (
						<div className="pagination">
							<Pagination
								page={searchFilter.page}
								count={Math.ceil(productTotal / searchFilter.limit) || 1}
								onChange={productPaginationChangeHandler}
							/>
							<span>{productTotal} products total</span>
						</div>
					)}
				</Stack>

				{/* ── REVIEWS ── */}
				<Stack className="review-box">
					<div className="main-intro">
						<span>Customer Reviews</span>
						<p>What people are saying about this brand</p>
					</div>

					{brandComments.length > 0 && (
						<div className="review-wrap">
							<div className="title-box">
								{[1, 2, 3, 4, 5].map((s) => (
									<StarIcon key={s} />
								))}
								<span>{commentTotal} Reviews</span>
							</div>

							{brandComments.map((c) => (
								<ReviewCard key={c._id} comment={c} />
							))}

							<div className="pagination-box">
								<Pagination
									page={commentInquiry.page}
									count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
									onChange={commentPaginationChangeHandler}
								/>
							</div>
						</div>
					)}

					<div className="leave-review-config">
						<Typography className="main-title">Leave a Review</Typography>
						<Typography className="review-title">Your thoughts</Typography>
						<textarea
							placeholder="Share your experience with this brand…"
							value={insertCommentData.commentContent}
							onChange={(e) => setInsertCommentData({ ...insertCommentData, commentContent: e.target.value })}
						/>
						<div className="submit-btn">
							<button
								className="submit-review"
								onClick={createCommentHandler}
								disabled={!insertCommentData.commentContent.trim()}
							>
								<span className="title">Submit Review</span>
							</button>
						</div>
					</div>
				</Stack>
			</Stack>
		</Stack>
	);
};

BrandDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: { memberId: null, productTypeList: [] },
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(BrandDetail);
