'use client';

import { Box, Typography, Grid, Card, CardActionArea } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ProductType } from '@/libs/enums/product.enum';

const categoryData = [
	{
		type: ProductType.SKINCARE,
		label: 'Skincare',
		href: '/shop/skin',
		image: '/img/categories/skincare.jpg',
		accent: '#e8c9a0',
	},
	{
		type: ProductType.MAKEUP,
		label: 'Makeup',
		href: '/shop/makeup',
		image: '/img/categories/makeup.avif',
		accent: '#d4a5a5',
	},
	{
		type: ProductType.HAIRCARE,
		label: 'Haircare',
		href: '/shop/hair',
		image: '/img/categories/haircare.jpg',
		accent: '#b8c4bb',
	},
	{
		type: ProductType.BODYCARE,
		label: 'Bodycare',
		href: '/shop/body',
		image: '/img/categories/bodycare.jpg',
		accent: '#c9b8a8',
	},
	{
		type: ProductType.FRAGRANCE,
		label: 'Fragrance',
		href: '/shop/fragrance',
		image: '/img/categories/fragrance.avif',
		accent: '#f0d9d9',
	},
	{
		type: ProductType.TOOLS,
		label: 'Tools',
		href: '/shop/tools',
		image: '/img/categories/tools.webp',
		accent: '#c9d1d3',
	},
	{
		type: ProductType.WELLNESS,
		label: 'Wellness',
		href: '/shop/wellness',
		image: '/img/categories/wellnesss.jpg',
		accent: '#dcd6f7',
	},

	{
		type: ProductType.BABYCARE,
		label: 'Babycare',
		href: '/shop/babycare',
		image: '/img/categories/babycare.jpg',
		accent: '#dcd6f7',
	},
];

export default function ShopByCategories() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<Box className="shop-by-categories" sx={{ px: { xs: 2, md: 4 }, py: 8 }}>
			<Box className="header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, alignItems: 'center' }}>
				<Typography variant="h4" fontWeight={700}>
					Need a Little Guidance?
				</Typography>
				<span style={{ color: '#ec4899' }}>Check out what's popular now.</span>

				<Link href="/shop" className="view-all">
					<Typography variant="body2" color="textSecondary">
						View All
					</Typography>
				</Link>
			</Box>

			<Grid container spacing={3}>
				{categoryData.map((cat, i) => (
					<Grid item xs={6} sm={4} md={3} key={cat.type}>
						<Card
							className={`category-card ${hoveredIndex === i ? 'hovered' : ''}`}
							onMouseEnter={() => setHoveredIndex(i)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<CardActionArea component={Link} href={cat.href}>
								<Box className="image-wrapper">
									<Image src={cat.image} alt={cat.label} fill className="image" />
									<Box className="glow" style={{ backgroundColor: cat.accent }} />
									<Box className="label">
										<Typography variant="subtitle1" fontWeight={600} color="white">
											{cat.label}
										</Typography>
									</Box>
								</Box>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
