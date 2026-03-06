'use client';

// components/ShopByCategories.tsx
// Usage: import ShopByCategories from '@/components/ShopByCategories'
// Requires: next/image, next/link — built into Next.js
// Place your images in /public/categories/

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Category {
	label: string;
	href: string;
	image: string;
	alt: string;
	count: number;
	accent: string;
}

const categories: Category[] = [
	{
		label: 'Face',
		href: '/shop/face',
		image: '/categories/face.jpg',
		alt: 'Model holding face product',
		count: 24,
		accent: '#e8c9a0',
	},
	{
		label: 'Eyes',
		href: '/shop/eyes',
		image: '/categories/eyes.jpg',
		alt: 'Model applying eye product',
		count: 18,
		accent: '#b8c4bb',
	},
	{
		label: 'Lips',
		href: '/shop/lips',
		image: '/categories/lips.jpg',
		alt: 'Model applying lip color',
		count: 31,
		accent: '#d4a5a5',
	},
	{
		label: 'Skin',
		href: '/shop/skin',
		image: '/categories/skin.jpg',
		alt: 'Model holding skincare product',
		count: 22,
		accent: '#c9b8a8',
	},
];

export default function ShopByCategories(): JSX.Element {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<section className="section">
			<div className="header">
				<h2 className="title">
					Shop by <em>Categories</em>
				</h2>
				<Link href="/shop" className="view-all">
					View All
				</Link>
			</div>

			<div className="grid">
				{categories.map((cat, i) => (
					<Link
						key={cat.label}
						href={cat.href}
						className="card"
						style={{ '--accent': cat.accent } as React.CSSProperties}
						onMouseEnter={() => setHoveredIndex(i)}
						onMouseLeave={() => setHoveredIndex(null)}
						aria-label={`Shop ${cat.label} — ${cat.count} products`}
					>
						<div className="image-wrap">
							<Image
								src={cat.image}
								alt={cat.alt}
								fill
								sizes="(max-width: 480px) 45vw, (max-width: 900px) 45vw, 25vw"
								className="img"
								priority={i < 2}
							/>
						</div>

						<div className="overlay" />

						<div className="card-footer">
							<span className="label">{cat.label}</span>
							<span className="count">{cat.count} products</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
