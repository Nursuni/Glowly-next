import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta
					name="keywords"
					content="Glowly, cosmetics, skincare, makeup, beauty products, korean beauty, K-beauty, online cosmetics store"
				/>
				<meta
					name="description"
					content={
						'Discover premium skincare and makeup products for glowing, healthy skin. Shop the latest beauty trends at Glowly | ' +
						'Откройте для себя премиальную косметику и средства по уходу за кожей для сияющей и здоровой кожи. Покупайте лучшие бьюти-продукты на Glowly | ' +
						'Glowly에서 프리미엄 스킨케어와 메이크업 제품을 만나보세요. 건강하고 빛나는 피부를 위한 최고의 뷰티 제품을 쇼핑하세요.'
					}
				/>

				{/* Open Graph (Important for social sharing) */}
				<meta property="og:title" content="Glowly – Premium Cosmetics & Skincare" />
				<meta property="og:description" content="Shop high-quality skincare and makeup products for radiant beauty." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/img/logo/Glowly.svg" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
