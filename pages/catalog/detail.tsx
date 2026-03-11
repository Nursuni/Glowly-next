import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { dummyProducts } from '../../libs/dummyProducts';
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
	const user = useReactiveVar(userVar);

	// Use first dummy product for now — swap with Apollo query later
	const product = dummyProducts[0];

	const [activeImage, setActiveImage] = useState<string>(product?.productImages?.[0] ?? '');
	const [isLiked, setIsLiked] = useState<boolean>(product?.meLiked?.[0]?.myFavorite ?? false);
	const [quantity, setQuantity] = useState<number>(1);
	const [reviewText, setReviewText] = useState<string>('');
	const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

	const price = product?.productPrice ? `$${Number(product.productPrice).toFixed(2)}` : '';
	const relatedProducts = dummyProducts.filter((p) => p._id !== product._id).slice(0, 4);

	const likeHandler = () => {
		if (!user?._id) return;
		setIsLiked((prev) => !prev);
	};

	if (device === 'mobile') {
		return <div className="product-detail-mobile">PRODUCT DETAIL PAGE</div>;
	}

	return (
		<div id="product-detail-page">
			{/* ── Breadcrumb ─────────────────────────────────── */}
			<div className="pd-breadcrumb">
				<div className="pd-container">
					<span onClick={() => router.push('/')}>Home</span>
					<span className="sep">›</span>
					<span onClick={() => router.push('/product')}>Products</span>
					<span className="sep">›</span>
					<span className="current">{product?.productTitle}</span>
				</div>
			</div>

			{/* ── Main Split Layout ───────────────────────────── */}
			<div className="pd-container">
				<div className="pd-main">
					{/* LEFT — Gallery */}
					<div className="pd-gallery">
						{/* Thumbnails — vertical strip */}
						<div className="pd-thumbs">
							{product?.productImages?.map((img, i) => (
								<div
									key={i}
									className={`pd-thumb ${activeImage === img ? 'active' : ''}`}
									onClick={() => setActiveImage(img)}
								>
									<img
										src={`${REACT_APP_API_URL}/${img}`}
										onError={(e) => {
											(e.target as HTMLImageElement).src = '/img/products/serum1.jpg';
										}}
										alt={`thumb-${i}`}
									/>
								</div>
							))}
						</div>

						{/* Main image */}
						<div className="pd-main-img-wrap">
							{/* Badges */}
							{product?.productCategory && (
								<span className="pd-badge pd-badge--category">{product.productCategory}</span>
							)}
							<span className="pd-badge pd-badge--new">New</span>

							<img
								src={activeImage ? `${REACT_APP_API_URL}/${activeImage}` : '/img/products/serum1.jpg'}
								onError={(e) => {
									(e.target as HTMLImageElement).src = '/img/products/serum1.jpg';
								}}
								alt={product?.productTitle}
								className="pd-main-img"
							/>

							{/* Like overlay */}
							<button className="pd-img-like" onClick={likeHandler}>
								{isLiked ? (
									<FavoriteIcon className="pd-like-icon active" />
								) : (
									<FavoriteBorderIcon className="pd-like-icon" />
								)}
							</button>
						</div>
					</div>

					{/* RIGHT — Info */}
					<div className="pd-info">
						{/* Brand */}
						{product?.productType && <span className="pd-brand">{product.productType}</span>}

						{/* Title */}
						<h1 className="pd-title">{product?.productTitle ?? 'Product Name'}</h1>

						{/* Rating row */}
						<div className="pd-rating-row">
							<div className="pd-stars">
								{[1, 2, 3, 4, 5].map((s) =>
									s <= 4 ? (
										<StarIcon key={s} className="pd-star filled" />
									) : (
										<StarBorderIcon key={s} className="pd-star" />
									),
								)}
							</div>
							<span className="pd-rating-count">{product?.productComments ?? 0} reviews</span>
							<span className="pd-dot" />
							<RemoveRedEyeIcon className="pd-eye-icon" />
							<span className="pd-views">{product?.productViews ?? 0} views</span>
						</div>

						{/* Price */}
						<div className="pd-price-row">
							<span className="pd-price">{price}</span>
							{product?.productStock && product.productStock > 0 ? (
								<span className="pd-stock in-stock">In Stock ({product.productStock})</span>
							) : (
								<span className="pd-stock out-of-stock">Out of Stock</span>
							)}
						</div>

						{/* Skin type tags */}
						{product?.skinType && product.skinType.length > 0 && (
							<div className="pd-skin-row">
								<span className="pd-skin-label">Skin Type</span>
								<div className="pd-skin-tags">
									{product.skinType.map((type) => (
										<span key={type} className="pd-skin-tag">
											{type.charAt(0) + type.slice(1).toLowerCase()}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Short desc */}
						<p className="pd-short-desc">{product?.productDesc}</p>

						{/* Divider */}
						<div className="pd-divider" />

						{/* Quantity + Add to cart */}
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

							<button className="pd-btn-cart">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<circle cx="9" cy="21" r="1" />
									<circle cx="20" cy="21" r="1" />
									<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
								</svg>
								Add to Cart
							</button>

							<button className="pd-btn-wishlist" onClick={likeHandler}>
								{isLiked ? (
									<FavoriteIcon className="pd-wish-icon active" />
								) : (
									<FavoriteBorderIcon className="pd-wish-icon" />
								)}
							</button>
						</div>

						{/* Meta info */}
						<div className="pd-meta">
							<div className="pd-meta-row">
								<span className="pd-meta-key">Category</span>
								<span className="pd-meta-val">{product?.productCategory}</span>
							</div>
							<div className="pd-meta-row">
								<span className="pd-meta-key">Type</span>
								<span className="pd-meta-val">{product?.productType}</span>
							</div>
							<div className="pd-meta-row">
								<span className="pd-meta-key">Likes</span>
								<span className="pd-meta-val">{product?.productLikes ?? 0}</span>
							</div>
						</div>
					</div>
				</div>

				{/* ── Tabs ────────────────────────────────────── */}
				<div className="pd-tabs-section">
					<div className="pd-tabs">
						{(['description', 'details', 'reviews'] as const).map((tab) => (
							<button
								key={tab}
								className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
								onClick={() => setActiveTab(tab)}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
								{tab === 'reviews' && ` (${product?.productComments ?? 0})`}
							</button>
						))}
					</div>

					<div className="pd-tab-content">
						{activeTab === 'description' && (
							<div className="pd-tab-desc">
								<p>{product?.productDesc}</p>
								<p>
									Experience the pinnacle of K-beauty innovation. This carefully formulated product combines the finest
									ingredients to deliver visible results from the very first use. Suitable for daily use, morning and
									evening.
								</p>
								<ul className="pd-feature-list">
									<li>Dermatologically tested and approved</li>
									<li>Free from parabens, sulfates, and artificial fragrances</li>
									<li>Cruelty-free and sustainably sourced</li>
									<li>Results visible within 2 weeks of consistent use</li>
								</ul>
							</div>
						)}

						{activeTab === 'details' && (
							<div className="pd-tab-details">
								<div className="pd-details-grid">
									<div className="pd-detail-item">
										<span className="pd-detail-key">Product Name</span>
										<span className="pd-detail-val">{product?.productTitle}</span>
									</div>
									<div className="pd-detail-item">
										<span className="pd-detail-key">Category</span>
										<span className="pd-detail-val">{product?.productCategory}</span>
									</div>
									<div className="pd-detail-item">
										<span className="pd-detail-key">Type</span>
										<span className="pd-detail-val">{product?.productType}</span>
									</div>
									<div className="pd-detail-item">
										<span className="pd-detail-key">Skin Type</span>
										<span className="pd-detail-val">
											{product?.skinType?.map((t) => t.charAt(0) + t.slice(1).toLowerCase()).join(', ')}
										</span>
									</div>
									<div className="pd-detail-item">
										<span className="pd-detail-key">Stock</span>
										<span className="pd-detail-val">{product?.productStock} units</span>
									</div>
									<div className="pd-detail-item">
										<span className="pd-detail-key">Price</span>
										<span className="pd-detail-val">{price}</span>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className="pd-tab-reviews">
								{product?.productComments === 0 ? (
									<p className="pd-no-reviews">No reviews yet. Be the first to review this product.</p>
								) : (
									<p className="pd-no-reviews">Reviews coming soon.</p>
								)}

								{/* Leave a review */}
								<div className="pd-leave-review">
									<h3 className="pd-review-title">Leave a Review</h3>
									<div className="pd-review-stars">
										{[1, 2, 3, 4, 5].map((s) => (
											<StarBorderIcon key={s} className="pd-review-star" />
										))}
									</div>
									<textarea
										className="pd-review-textarea"
										placeholder="Share your experience with this product…"
										value={reviewText}
										onChange={(e) => setReviewText(e.target.value)}
									/>
									<button className="pd-review-submit" disabled={!reviewText.trim() || !user?._id}>
										Submit Review
										<svg width="14" height="14" viewBox="0 0 17 17" fill="none">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="currentColor"
											/>
										</svg>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ── Related Products ────────────────────────── */}
				{relatedProducts.length > 0 && (
					<div className="pd-related">
						<div className="pd-related-header">
							<span className="pd-related-eyebrow">You may also like</span>
							<h2 className="pd-related-title">
								Related <em>Products</em>
							</h2>
						</div>

						<Swiper
							className="pd-related-swiper"
							slidesPerView="auto"
							spaceBetween={20}
							modules={[Autoplay, Navigation]}
							navigation={{
								nextEl: '.pd-swiper-next',
								prevEl: '.pd-swiper-prev',
							}}
						>
							{relatedProducts.map((p) => (
								<SwiperSlide key={p._id} className="pd-related-slide">
									<div className="pd-related-card" onClick={() => router.push(`/catalog/detail?productId=${p._id}`)}>
										<div className="pd-related-img-wrap">
											<img
												src={`${REACT_APP_API_URL}/${p.productImages?.[0]}`}
												onError={(e) => {
													(e.target as HTMLImageElement).src = '/img/products/serum1.jpg';
												}}
												alt={p.productTitle}
											/>
											<div className="pd-related-overlay" />
										</div>
										<div className="pd-related-info">
											<span className="pd-related-brand">{p.productType}</span>
											<strong className="pd-related-name">{p.productTitle}</strong>
											<span className="pd-related-price">${Number(p.productPrice).toFixed(2)}</span>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>

						<div className="pd-swiper-nav">
							<button className="pd-swiper-prev">←</button>
							<button className="pd-swiper-next">→</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutFull(ProductDetail);
