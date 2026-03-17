import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';

import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';

import { GET_PRODUCT, GET_PRODUCTS, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT, ADD_TO_VISITED } from '@/apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { cartVar } from '../../apollo/store';
import { Direction, Message } from '../../libs/enums/common.enum';

import { Comment } from '@/libs/types/comment/comment';
import { CommentInput, CommentsInquiry } from '@/libs/types/comment/comment.input';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { toastError } from '@/libs/toast';
import { CircularProgress, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import 'swiper/css';
import 'swiper/css/pagination';
import BasketModal, { CartItem } from '@/libs/components/basket/BasketModal';
import ShareModal from '@/libs/components/common/ShareModel';
import { T } from '@/libs/types/common';

SwiperCore.use([Autoplay, Navigation, Pagination]);

const initialComment: CommentsInquiry = {
	page: 1,
	limit: 5,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: { commentRefId: '' },
};

export const getServerSideProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { productId } = router.query;

	const user = useReactiveVar(userVar);
	const cartItems = useReactiveVar(cartVar);

	const [product, setProduct] = useState<any>(null);
	const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
	const [activeImage, setActiveImage] = useState('');
	const [isLiked, setIsLiked] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
	const [basketOpen, setBasketOpen] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);

	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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
	const [addToVisited] = useMutation(ADD_TO_VISITED);

	/** Fetch Product **/
	const { loading: productLoading, refetch: getProductRefetch } = useQuery(GET_PRODUCT, {
		variables: { productId: productId as string },
		skip: !router.isReady || !productId,
		onCompleted: (data: T) => {
			if (data?.getProduct) {
				const p = data.getProduct;
				setProduct(p);
				setActiveImage(p.productImages?.[0] ?? '');
				setIsLiked(p?.meLiked?.[0]?.myFavorite ?? false);
				setCommentInquiry((prev) => ({
					...prev,
					search: { ...prev.search, commentRefId: p._id },
				}));
				setInsertCommentData((prev) => ({ ...prev, commentRefId: p._id }));
				if (user?._id) {
					addToVisited({ variables: { input: p._id } }).catch(() => {});
				}
			}
		},
	});

	/** Fetch Related Products **/
	const { refetch: getProductsRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: { page: 1, limit: 4, sort: 'createdAt', direction: -1, search: {} },
		},
		onCompleted: (data: T) => {
			if (data?.getProducts?.list) setRelatedProducts(data.getProducts.list);
		},
	});

	/** Fetch Comments **/
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
		if (router.isReady && productId) {
			getProductRefetch({ productId: productId as string });
		}
	}, [router.isReady, productId]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** Like Product **/
	const likeProductHandler = async () => {
		try {
			if (!product?._id) return;
			if (!user?._id) {
				toastError('Please login first');
				return;
			}
			await likeTargetProduct({ variables: { input: product._id } });
			setIsLiked((prev) => !prev);
			await getProductRefetch({ productId: product._id });
			await getProductsRefetch({
				input: { page: 1, limit: 4, sort: 'createdAt', direction: -1, search: {} },
			});
		} catch (err) {
			console.log('likeProductHandler error:', err);
		}
	};

	const addToCartHandler = () => {
		if (!product) return;
		const newItem: CartItem = {
			_id: product._id,
			productName: product.productTitle,
			productBrand: product.memberData?.memberNick ?? 'Brand',
			productImage: `${API_URL}/${product.productImages?.[0]}`,
			unitPrice: Number(product.productPrice),
			quantity: quantity,
			inStock: product.productStatus === 'ACTIVE',
		};
		const current = cartVar();
		const existing = current.find((item) => item._id === newItem._id);
		if (existing) {
			cartVar(
				current.map((item) => (item._id === newItem._id ? { ...item, quantity: item.quantity + quantity } : item)),
			);
		} else {
			cartVar([...current, newItem]);
		}
		setBasketOpen(true);
	};

	const handleQtyChange = (id: string, delta: number) => {
		cartVar(
			cartVar().map((item) => (item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
		);
	};

	const handleRemove = (id: string) => {
		cartVar(cartVar().filter((item) => item._id !== id));
	};

	/** Create Comment **/
	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!insertCommentData.commentContent.trim()) {
				toastError('Please write a review');
				return;
			}
			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			toastError(err instanceof Error ? err.message : String(err));
		}
	};

	if (device === 'mobile') return <div>PRODUCT DETAIL MOBILE</div>;

	if (productLoading || !product)
		return (
			<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress size="4rem" />
			</Stack>
		);

	const price = `$${Number(product.productPrice).toFixed(2)}`;
	const inStock = product.productStatus === 'ACTIVE';
	const starCount = Math.min(5, Math.round((product.productLikes ?? 0) / 3));
	const renderStars = () =>
		Array.from({ length: 5 }, (_, i) => <StarIcon key={i} className={`pd-star ${i < starCount ? 'filled' : ''}`} />);

	return (
		<div id="product-detail-page">
			{/* ── Modals ── */}
			<BasketModal
				open={basketOpen}
				onClose={() => setBasketOpen(false)}
				items={cartItems}
				onQtyChange={handleQtyChange}
				onRemove={handleRemove}
			/>
			<ShareModal
				open={shareOpen}
				onClose={() => setShareOpen(false)}
				url={shareUrl}
				title={product?.productTitle ?? 'Check this product!'}
			/>

			{/* ── Breadcrumb ── */}
			<div className="pd-breadcrumb">
				<div className="pd-container">
					<span onClick={() => router.push('/')}>Home</span>
					<span className="sep">/</span>
					<span onClick={() => router.push('/catalog')}>Products</span>
					<span className="sep">/</span>
					<span className="current">{product.productTitle}</span>
				</div>
			</div>

			<div className="pd-container">
				<div className="pd-main">
					{/* ── Gallery ── */}
					<div className="pd-gallery">
						<div className="pd-thumbs">
							{product.productImages?.map((img: string, i: number) => (
								<div
									key={i}
									className={`pd-thumb ${activeImage === img ? 'active' : ''}`}
									onClick={() => setActiveImage(img)}
								>
									<img src={`${API_URL}/${img}`} alt={`thumb-${i}`} />
								</div>
							))}
						</div>
						<div className="pd-main-img-wrap">
							<span className="pd-badge pd-badge--category">{product.productType ?? 'Skincare'}</span>
							<span className="pd-badge pd-badge--new">New</span>
							<button className="pd-img-like" onClick={likeProductHandler}>
								{isLiked ? (
									<FavoriteIcon className="pd-like-icon active" />
								) : (
									<FavoriteBorderIcon className="pd-like-icon" />
								)}
							</button>
							<img className="pd-main-img" src={`${API_URL}/${activeImage}`} alt={product.productTitle} />
						</div>
					</div>

					{/* ── Info ── */}
					<div className="pd-info">
						<span className="pd-brand">{product.memberData?.memberNick ?? 'Brand'}</span>
						<h1 className="pd-title">{product.productTitle}</h1>

						<div className="pd-rating-row">
							<div className="pd-stars">{renderStars()}</div>
							<span className="pd-rating-count">{commentTotal} reviews</span>
							<span className="pd-dot" />
							<VisibilityOutlinedIcon className="pd-eye-icon" />
							<span className="pd-views">{product.productViews ?? 0} views</span>
						</div>

						<div className="pd-price-row">
							<span className="pd-price">{price}</span>
							<span className={`pd-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
								{inStock ? `In Stock (${product.volume ?? 50})` : 'Out of Stock'}
							</span>
						</div>

						{product.skinType?.length > 0 && (
							<div className="pd-skin-row">
								<span className="pd-skin-label">Skin Type</span>
								<div className="pd-skin-tags">
									{(Array.isArray(product.skinType) ? product.skinType : [product.skinType]).map(
										(type: string, i: number) => (
											<span key={i} className="pd-skin-tag">
												{type}
											</span>
										),
									)}
								</div>
							</div>
						)}

						<p className="pd-short-desc">{product.productDesc}</p>
						<div className="pd-divider" />

						{/* ── Actions row: qty + cart + wishlist + share ── */}
						<div className="pd-actions">
							<div className="pd-qty">
								<button className="pd-qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
									−
								</button>
								<span className="pd-qty-num">{quantity}</span>
								<button className="pd-qty-btn" onClick={() => setQuantity((q) => q + 1)}>
									+
								</button>
							</div>

							<button className="pd-btn-cart" onClick={addToCartHandler} disabled={!inStock}>
								<ShoppingCartOutlinedIcon style={{ fontSize: 18 }} />
								{inStock ? 'Add to Cart' : 'Out of Stock'}
							</button>

							<button className="pd-btn-wishlist" onClick={likeProductHandler}>
								{isLiked ? (
									<FavoriteIcon className="pd-wish-icon active" />
								) : (
									<FavoriteBorderIcon className="pd-wish-icon" />
								)}
							</button>

							{/* ✅ Share button — same row as wishlist */}
							<button className="pd-btn-share" onClick={() => setShareOpen(true)}>
								<ShareOutlinedIcon style={{ fontSize: 18 }} />
							</button>
						</div>

						<div className="pd-meta">
							<div className="pd-meta-row">
								<span className="pd-meta-key">Category</span>
								<span className="pd-meta-val">{product.productType ?? '—'}</span>
							</div>
							<div className="pd-meta-row">
								<span className="pd-meta-key">Type</span>
								<span className="pd-meta-val">{product.ingredientType ?? '—'}</span>
							</div>
						</div>
					</div>
				</div>

				{/* ── Tabs ── */}
				<div className="pd-tabs-section">
					<div className="pd-tabs">
						{(['description', 'details', 'reviews'] as const).map((tab) => (
							<button
								key={tab}
								className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
								onClick={() => setActiveTab(tab)}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>
					<div className="pd-tab-content">
						{activeTab === 'description' && (
							<div className="pd-tab-desc">
								<p>{product.productDesc}</p>
								<ul className="pd-feature-list">
									{product.skinType && (
										<li>
											Skin Type: {Array.isArray(product.skinType) ? product.skinType.join(', ') : product.skinType}
										</li>
									)}
									{product.productTarget && <li>Target: {product.productTarget}</li>}
									{product.ageRange && <li>Age Range: {product.ageRange}</li>}
									{product.ingredientType && <li>Key Ingredients: {product.ingredientType}</li>}
								</ul>
							</div>
						)}
						{activeTab === 'details' && (
							<div className="pd-details-grid">
								<div className="pd-detail-item">
									<span className="pd-detail-key">Volume</span>
									<span className="pd-detail-val">
										{product.volume ?? '—'} {product.volumeUnit ?? ''}
									</span>
								</div>
								<div className="pd-detail-item">
									<span className="pd-detail-key">Type</span>
									<span className="pd-detail-val">{product.productType ?? '—'}</span>
								</div>
								<div className="pd-detail-item">
									<span className="pd-detail-key">Target</span>
									<span className="pd-detail-val">{product.productTarget ?? '—'}</span>
								</div>
								<div className="pd-detail-item">
									<span className="pd-detail-key">Ingredients</span>
									<span className="pd-detail-val">{product.ingredientType ?? '—'}</span>
								</div>
								<div className="pd-detail-item">
									<span className="pd-detail-key">Manufactured</span>
									<span className="pd-detail-val">
										{product.manufacturedAt ? new Date(product.manufacturedAt).toLocaleDateString() : '—'}
									</span>
								</div>
								<div className="pd-detail-item">
									<span className="pd-detail-key">Expires</span>
									<span className="pd-detail-val">
										{product.expiresAt ? new Date(product.expiresAt).toLocaleDateString() : '—'}
									</span>
								</div>
							</div>
						)}
						{activeTab === 'reviews' && (
							<div>
								{propertyComments.length === 0 && (
									<p className="pd-no-reviews">No reviews yet. Be the first to share your thoughts.</p>
								)}
								{propertyComments.map((c: Comment) => (
									<div key={c._id} style={{ marginBottom: 16, padding: '16px 0', borderBottom: '1px solid #f0ebe4' }}>
										<strong style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>
											{c.memberData?.memberNick ?? 'Anonymous'}
										</strong>
										<p style={{ margin: '8px 0 0', fontSize: 14, color: '#666', lineHeight: 1.7 }}>
											{c.commentContent}
										</p>
									</div>
								))}
								<div className="pd-leave-review">
									<h3 className="pd-review-title">Leave a Review</h3>
									<div className="pd-review-stars">
										{Array.from({ length: 5 }, (_, i) => (
											<StarBorderIcon key={i} className="pd-review-star" />
										))}
									</div>
									<textarea
										className="pd-review-textarea"
										placeholder="Share your experience with this product..."
										value={insertCommentData.commentContent}
										onChange={(e) => setInsertCommentData({ ...insertCommentData, commentContent: e.target.value })}
									/>
									<button
										className="pd-review-submit"
										onClick={createCommentHandler}
										disabled={!insertCommentData.commentContent.trim()}
									>
										Submit Review
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ── Related Products ── */}
				{relatedProducts.length > 0 && (
					<div className="pd-related">
						<div className="pd-related-header">
							<span className="pd-related-eyebrow">You May Also Like</span>
							<h2 className="pd-related-title">
								Related <em>Products</em>
							</h2>
						</div>
						<Swiper
							className="pd-related-swiper"
							slidesPerView="auto"
							spaceBetween={20}
							navigation={{ prevEl: '.pd-swiper-prev', nextEl: '.pd-swiper-next' }}
						>
							{relatedProducts.map((p) => (
								<SwiperSlide key={p._id} className="pd-related-slide">
									<div className="pd-related-card" onClick={() => router.push(`/catalog/detail?productId=${p._id}`)}>
										<div className="pd-related-img-wrap">
											<img src={`${API_URL}/${p.productImages?.[0]}`} alt={p.productTitle} />
											<div className="pd-related-overlay" />
										</div>
										<div className="pd-related-info">
											<span className="pd-related-brand">{p.memberData?.memberNick ?? 'Brand'}</span>
											<span className="pd-related-name">{p.productTitle}</span>
											<span className="pd-related-price">${Number(p.productPrice).toFixed(2)}</span>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
						<div className="pd-swiper-nav">
							<button className="pd-swiper-prev">
								<ChevronLeftIcon />
							</button>
							<button className="pd-swiper-next">
								<ChevronRightIcon />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutFull(ProductDetail);
