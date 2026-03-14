import React, { useState } from 'react';
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

import { GET_PRODUCT, GET_PRODUCTS } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '@/apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { Direction } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

import 'swiper/css';
import 'swiper/css/pagination';

SwiperCore.use([Autoplay, Navigation, Pagination]);

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
	const [activeImage, setActiveImage] = useState<string>('');
	const [isLiked, setIsLiked] = useState(false);
	const [quantity, setQuantity] = useState(1);

	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	/** LIKE MUTATION **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	/** GET PRODUCT **/
	const { loading: productLoading, refetch: getProductRefetch } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: productId },
		skip: !productId,
		onCompleted: (data: T) => {
			if (data?.getProduct) {
				setProduct(data.getProduct);
				setActiveImage(data.getProduct.productImages?.[0]);
				setIsLiked(data.getProduct?.meLiked?.[0]?.myFavorite ?? false);
			}
		},
	});

	/** RELATED PRODUCTS **/
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

	/** LIKE HANDLER **/
	const likeProductHandler = async () => {
		try {
			if (!product?._id) return;

			if (!user?._id) {
				alert('Please login first');
				return;
			}

			await likeTargetProduct({
				variables: { input: product._id },
			});

			setIsLiked((prev) => !prev);

			await getProductRefetch({ input: product._id });

			await getProductsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {},
				},
			});
		} catch (err) {
			console.log('likeProductHandler error:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT DETAIL MOBILE</div>;
	}

	if (productLoading || !product) {
		return <div>Loading product...</div>;
	}

	const price = `$${Number(product.productPrice).toFixed(2)}`;

	return (
		<div id="product-detail-page">
			{/* BREADCRUMB */}
			<div className="pd-breadcrumb">
				<div className="pd-container">
					<span onClick={() => router.push('/')}>Home</span>
					<span> › </span>
					<span onClick={() => router.push('/catalog')}>Products</span>
					<span> › </span>
					<span>{product.productTitle}</span>
				</div>
			</div>

			<div className="pd-container">
				<div className="pd-main">
					{/* GALLERY */}
					<div className="pd-gallery">
						<div className="pd-thumbs">
							{product.productImages?.map((img: string, i: number) => (
								<div
									key={i}
									className={`pd-thumb ${activeImage === img ? 'active' : ''}`}
									onClick={() => setActiveImage(img)}
								>
									<img src={`${API_URL}/${img}`} alt="thumb" />
								</div>
							))}
						</div>

						<div className="pd-main-img-wrap">
							<img src={`${API_URL}/${activeImage}`} className="pd-main-img" />

							<button className="pd-img-like" onClick={likeProductHandler}>
								{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</button>
						</div>
					</div>

					{/* INFO */}
					<div className="pd-info">
						<h1>{product.productTitle}</h1>

						<div className="pd-rating-row">
							{[1, 2, 3, 4, 5].map((s) => (s <= 4 ? <StarIcon key={s} /> : <StarBorderIcon key={s} />))}

							<span>{product.productComments ?? 0} reviews</span>

							<RemoveRedEyeIcon />
							<span>{product.productViews}</span>
						</div>

						<div className="pd-price-row">
							<span className="pd-price">{price}</span>
						</div>

						<p>{product.productDesc}</p>

						{/* QUANTITY */}
						<div className="pd-actions">
							<button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>

							<span>{quantity}</span>

							<button onClick={() => setQuantity((q) => q + 1)}>+</button>

							<button className="pd-btn-cart">Add to Cart</button>
						</div>
					</div>
				</div>

				{/* RELATED PRODUCTS */}
				{relatedProducts.length > 0 && (
					<div className="pd-related">
						<h2>Related Products</h2>

						<Swiper slidesPerView="auto" spaceBetween={20}>
							{relatedProducts.map((p) => (
								<SwiperSlide key={p._id}>
									<div className="pd-related-card" onClick={() => router.push(`/catalog/detail?productId=${p._id}`)}>
										<img src={`${API_URL}/${p.productImages?.[0]}`} />

										<strong>{p.productTitle}</strong>

										<span>${Number(p.productPrice).toFixed(2)}</span>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutFull(ProductDetail);
