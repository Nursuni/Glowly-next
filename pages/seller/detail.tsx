import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductBigCard from '../../libs/components/common/ProductBigCard';
import ReviewCard from '../../libs/components/seller/ReviewCard';
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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SellerDetail: NextPage = ({ initialInput, initialComment }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [mbId, setMbId] = useState<string | null>(null);
	const [seller, setSeller] = useState<Member | null>(null);

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [sellerComments, setSellerComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);

	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** LIFECYCLE **/
	useEffect(() => {
		if (router.query.sellerId) {
			setMbId(router.query.sellerId as string);
		}
	}, [router]);

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
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			// Your mutation logic here
		} catch (err: any) {
			toastError(err);
		}
	};

	if (device === 'mobile') {
		return <div>SELLER DETAIL PAGE MOBILE</div>;
	}

	return (
		<Stack className={'seller-detail-page'}>
			<Stack className={'container'}>
				{/* SELLER INFO */}
				<Stack className={'seller-info'}>
					<img
						src={seller?.memberImage ? `${REACT_APP_API_URL}/${seller?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt=""
					/>
					<Box component={'div'} className={'info'} onClick={() => redirectToMemberPageHandler(seller?._id as string)}>
						<strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
						<div>
							<img src="/img/icons/call.svg" alt="" />
							<span>{seller?.memberPhone}</span>
						</div>
					</Box>
				</Stack>

				{/* SELLER PRODUCTS */}
				<Stack className={'seller-product-list'}>
					<Stack className={'card-wrap'}>
						{sellerProducts.map((product: Product) => (
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

							{sellerComments.map((comment: Comment) => (
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

SellerDetail.defaultProps = {
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

export default withLayoutBasic(SellerDetail);
