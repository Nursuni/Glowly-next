import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductBigCard from '../../libs/components/common/ProductBigCard';

import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Product } from '../../libs/types/product/product';
import { Member } from '../../libs/types/member/member';

import { userVar } from '../../apollo/store';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toastError } from '../../libs/toast';
import ReviewCard from '@/libs/components/brand/ReviewCard';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MEMBER } from '@/apollo/user/query';
import { GET_PRODUCTS } from '@/apollo/user/query';
import { GET_COMMENTS } from '@/apollo/user/query';
import { CREATE_COMMENT } from '@/apollo/user/mutation';
import { toastSuccess } from '@/libs/toast';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BrandDetail: NextPage = ({ initialInput, initialComment }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [mbId, setMbId] = useState<string | null>(null);
	const [brand, setBrand] = useState<Member | null>(null);

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const [brandProducts, setBrandProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [brandComments, setBrandComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [createComment] = useMutation(CREATE_COMMENT);

	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});
	/** GET BRAND **/
	const { refetch: getBrandRefetch } = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: mbId },
		skip: !mbId,
		onCompleted: (data) => {
			setBrand(data?.getMember);
		},
	});
	/** GET BRAND PRODUCTS **/
	const { refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !mbId,
		onCompleted: (data) => {
			setBrandProducts(data?.getProducts?.list || []);
			setProductTotal(data?.getProducts?.metaCounter?.[0]?.total || 0);
		},
	});
	/** GET COMMENTS **/
	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !mbId,
		onCompleted: (data) => {
			setBrandComments(data?.getComments?.list || []);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLE **/
	useEffect(() => {
		if (router.query.brandId) {
			const id = router.query.brandId as string;
			setMbId(id);

			setSearchFilter((prev) => ({
				...prev,
				search: {
					...prev.search,
					memberId: id,
				},
			}));

			setCommentInquiry((prev) => ({
				...prev,
				search: {
					...prev.search,
					commentRefId: id,
				},
			}));
		}
	}, [router.query.brandId]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) {
				await router.push(`/mypage?memberId=${memberId}`);
			} else {
				await router.push(`/member?memberId=${memberId}`);
			}
		} catch (error) {
			await toastError(error);
		}
	};

	const productPaginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({
			...searchFilter,
			page: value,
		});
	};

	const commentPaginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		setCommentInquiry((prev) => ({
			...prev,
			page: value,
		}));
	};
	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error('Please login first');

			await createComment({
				variables: {
					input: {
						...insertCommentData,
						commentRefId: mbId,
					},
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
	if (device === 'mobile') {
		return <div>Brand DETAIL PAGE MOBILE</div>;
	}

	return (
		<Stack className={'brand-detail-page'}>
			<Stack className={'container'}>
				{/* Brand INFO */}
				<Stack className={'brand-info'}>
					<img
						src={brand?.memberImage ? `${REACT_APP_API_URL}/${brand?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt=""
					/>
					<Box
						component={'div'}
						className={'info'}
						onClick={() => brand?._id && redirectToMemberPageHandler(brand._id)}
					>
						<strong>{brand?.memberFullName ?? brand?.memberNick}</strong>
						<div>
							<img src="/img/icons/call.svg" alt="" />
							<span>{brand?.memberPhone}</span>
						</div>
					</Box>
				</Stack>

				{/* Brand PRODUCTS */}
				<Stack className={'brand-product-list'}>
					<Stack className={'card-wrap'}>
						{brandProducts.map((product: Product) => (
							<div className={'wrap-main'} key={product?._id}>
								<ProductBigCard product={product} likeProductHandler={undefined} />
							</div>
						))}
					</Stack>

					<Stack className={'pagination'}>
						{productTotal ? (
							<>
								<Stack className="pagination-box">
									<Pagination
										page={searchFilter.page}
										count={Math.ceil(productTotal / searchFilter.limit) || 1}
										onChange={productPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
								<span>
									Total {productTotal} product{productTotal > 1 ? 's' : ''} available
								</span>
							</>
						) : (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
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
							<Box component={'div'} className={'title-box'}>
								<StarIcon />
								<span>
									{commentTotal} review{commentTotal > 1 ? 's' : ''}
								</span>
							</Box>

							{brandComments.map((comment: Comment) => (
								<ReviewCard comment={comment} key={comment?._id} />
							))}

							<Box component={'div'} className={'pagination-box'}>
								<Pagination
									page={commentInquiry.page}
									count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
									onChange={commentPaginationChangeHandler}
									shape="circular"
									color="primary"
								/>
							</Box>
						</Stack>
					)}

					{/* LEAVE REVIEW */}
					<Stack className={'leave-review-config'}>
						<Typography className={'main-title'}>Leave A Review</Typography>
						<Typography className={'review-title'}>Review</Typography>

						<textarea
							onChange={({ target: { value } }: any) =>
								setInsertCommentData({
									...insertCommentData,
									commentContent: value,
								})
							}
							value={insertCommentData.commentContent}
						/>

						<Box className={'submit-btn'} component={'div'}>
							<Button
								className={'submit-review'}
								disabled={insertCommentData.commentContent === '' || !user?._id}
								onClick={createCommentHandler}
							>
								<Typography className={'title'}>Submit Review</Typography>
							</Button>
						</Box>
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
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(BrandDetail);
