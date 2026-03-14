import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';

import { GET_PRODUCT, GET_PRODUCTS, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT } from '@/apollo/user/mutation';

import { userVar } from '../../apollo/store';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

import 'swiper/css';
import 'swiper/css/pagination';

import { toastError } from '@/libs/toast';
import { CircularProgress, Stack } from '@mui/material';

import { Comment } from '@/libs/types/comment/comment';
import { CommentInput, CommentsInquiry } from '@/libs/types/comment/comment.input';
import { CommentGroup } from '@/libs/enums/comment.enum';

SwiperCore.use([Autoplay, Navigation, Pagination]);

const initialComment: CommentsInquiry = {
	page: 1,
	limit: 5,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		commentRefId: '',
	},
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { productId } = router.query;

	const user = useReactiveVar(userVar);

	const [product, setProduct] = useState<any>(null);
	const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
	const [activeImage, setActiveImage] = useState('');
	const [isLiked, setIsLiked] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [comment, setComment] = useState('');

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);

	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PRODUCT,
		commentContent: '',
		commentRefId: '',
	});

	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [createComment] = useMutation(CREATE_COMMENT);

	const { loading: productLoading, refetch: getProductRefetch } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: productId },
		skip: !productId,
		onCompleted: (data: T) => {
			if (data?.getProduct) {
				setProduct(data.getProduct);
				setActiveImage(data.getProduct.productImages?.[0]);
				setIsLiked(data.getProduct?.meLiked?.[0]?.myFavorite ?? false);

				setCommentInquiry((prev) => ({
					...prev,
					search: { commentRefId: data.getProduct._id },
				}));

				setInsertCommentData((prev) => ({
					...prev,
					commentRefId: data.getProduct._id,
				}));
			}
		},
	});

	const { refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			},
		},
		onCompleted: (data: T) => {
			if (data?.getProducts?.list) {
				setRelatedProducts(data.getProducts.list);
			}
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) {
				setPropertyComments(data.getComments.list);
				setCommentTotal(data.getComments.metaCounter?.[0]?.total ?? 0);
			}
		},
	});

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	const likeProductHandler = async () => {
		try {
			if (!product?._id) return;

			if (!user?._id) {
				alert('Please login first');
				return;
			}

			await likeTargetProduct({ variables: { input: product._id } });

			setIsLiked((prev) => !prev);

			await getProductRefetch({ input: product._id });
			await getProductsRefetch();
		} catch (err) {
			console.log('likeProductHandler error:', err);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			toastError(err);
		}
	};

	if (device === 'mobile') return <div>PRODUCT DETAIL MOBILE</div>;

	if (productLoading || !product) {
		return (
			<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	const price = `$${Number(product.productPrice).toFixed(2)}`;

	return (
		<div id="product-detail-page">
			<h1>{product.productTitle}</h1>

			<div className="pd-gallery">
				{product.productImages?.map((img: string, i: number) => (
					<img key={i} src={`${API_URL}/${img}`} onClick={() => setActiveImage(img)} />
				))}
			</div>

			<p>{price}</p>
			<p>{product.productDesc}</p>

			<div>
				<textarea
					value={insertCommentData.commentContent}
					onChange={(e) => setInsertCommentData({ ...insertCommentData, commentContent: e.target.value })}
				/>
				<button onClick={createCommentHandler}>Submit</button>
			</div>

			{propertyComments.map((c) => (
				<div key={c._id}>{c.commentContent}</div>
			))}

			{relatedProducts.length > 0 && (
				<Swiper slidesPerView={'auto'} spaceBetween={20}>
					{relatedProducts.map((p) => (
						<SwiperSlide key={p._id}>
							<div onClick={() => router.push(`/catalog/detail?productId=${p._id}`)}>
								<img src={`${API_URL}/${p.productImages?.[0]}`} />
								<strong>{p.productTitle}</strong>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</div>
	);
};

export default withLayoutFull(ProductDetail);
