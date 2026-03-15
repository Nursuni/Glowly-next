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
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '@/apollo/user/mutation';
import { LIKE_TARGET_PRODUCT } from '@/apollo/user/mutation';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toastError, toastSuccess } from '@/libs/toast';
import { Direction } from '@/libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
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
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [brandComments, setBrandComments] = useState<Comment[]>([]);

	const [commentTotal, setCommentTotal] = useState<number>(0);

	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	const [createComment] = useMutation(CREATE_COMMENT);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const [updateComment] = useMutation(UPDATE_COMMENT);

	/** GET BRAND **/
	useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: brandId },
		skip: !brandId,
		onCompleted: (data) => {
			const member = data?.getMember;

			setBrand(member);

			setSearchFilter((prev) => ({
				...prev,
				search: {
					memberId: member?._id,

					productTypeList: [],
				},
			}));

			setCommentInquiry((prev) => ({
				...prev,
				search: {
					commentRefId: member?._id,
				},
			}));

			setInsertCommentData((prev) => ({
				...prev,
				commentRefId: member?._id,
			}));
		},
	});

	/** GET PRODUCTS **/
	const { refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		onCompleted: (data) => {
			setBrandProducts(data?.getProducts?.list || []);
			setProductTotal(data?.getProducts?.metaCounter?.[0]?.total || 0);
		},
	});

	/** GET COMMENTS **/
	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		onCompleted: (data) => {
			setBrandComments(data?.getComments?.list || []);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		if (router.query.brandId) {
			setBrandId(router.query.brandId as string);
		}
	}, [router.query.brandId]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getProductsRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/

	const productPaginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Please login first');

			await createComment({
				variables: {
					input: insertCommentData,
				},
			});

			setInsertCommentData({
				...insertCommentData,
				commentContent: '',
			});

			await getCommentsRefetch({ input: commentInquiry });

			toastSuccess('Review added successfully');
		} catch (err: any) {
			toastError(err.message);
		}
	};
	const likeProductHandler = async (user: any, productId: string) => {
		try {
			if (!user?._id) throw new Error('Please login first');

			await likeTargetProduct({
				variables: {
					input: productId,
				},
			});

			await getProductsRefetch({ input: searchFilter });

			toastSuccess('Product liked successfully');
		} catch (err: any) {
			toastError(err.message);
		}
	};
	if (device === 'mobile') {
		return <div>BRAND DETAIL PAGE MOBILE</div>;
	}

	return (
		<Stack className={'brand-detail-page'}>
			<Stack className={'container'}>
				{/* BRAND INFO */}
				<Stack className={'brand-info'}>
					<img src={brand?.memberImage ? `${REACT_APP_API_URL}/${brand.memberImage}` : '/img/profile/user.svg'} />

					<Box className={'info'}>
						<strong>{brand?.memberFullName ?? brand?.memberNick}</strong>

						<div>
							<img src="/img/icons/call.svg" />
							<span>{brand?.memberPhone}</span>
						</div>
					</Box>
				</Stack>

				{/* BRAND PRODUCTS */}
				<Stack className={'brand-product-list'}>
					<Stack className={'card-wrap'}>
						{brandProducts.map((product: Product) => (
							<div className={'wrap-main'} key={product._id}>
								<ProductBigCard product={product} likeProductHandler={() => likeProductHandler(user, product._id)} />
							</div>
						))}
					</Stack>

					<Stack className={'pagination'}>
						{productTotal ? (
							<>
								<Pagination
									page={searchFilter.page}
									count={Math.ceil(productTotal / searchFilter.limit) || 1}
									onChange={productPaginationChangeHandler}
									shape="circular"
									color="primary"
								/>

								<span>
									Total {productTotal} product{productTotal > 1 ? 's' : ''}
								</span>
							</>
						) : (
							<div className={'no-data'}>
								<p>No products found!</p>
							</div>
						)}
					</Stack>
				</Stack>

				{/* REVIEWS */}
				<Stack className={'review-box'}>
					<Stack className={'main-intro'}>
						<span>Reviews</span>
						<p>We are glad to see you again</p>
					</Stack>

					{commentTotal !== 0 && (
						<Stack className={'review-wrap'}>
							<Box className={'title-box'}>
								<StarIcon />
								<span>
									{commentTotal} review{commentTotal > 1 ? 's' : ''}
								</span>
							</Box>

							{brandComments.map((comment: Comment) => (
								<ReviewCard comment={comment} key={comment._id} />
							))}

							<Pagination
								page={commentInquiry.page}
								count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
								onChange={commentPaginationChangeHandler}
								shape="circular"
								color="primary"
							/>
						</Stack>
					)}

					{/* LEAVE REVIEW */}
					<Stack className={'leave-review-config'}>
						<Typography className={'main-title'}>Leave A Review</Typography>

						<textarea
							value={insertCommentData.commentContent}
							onChange={(e) =>
								setInsertCommentData({
									...insertCommentData,
									commentContent: e.target.value,
								})
							}
						/>

						<Button disabled={!insertCommentData.commentContent || !user?._id} onClick={createCommentHandler}>
							Submit Review
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

BrandDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.ASC,
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(BrandDetail);
