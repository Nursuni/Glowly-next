import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ProductData {
	productName: string;
	brand: string;
	price: string;
	description: string;
	imageSrc: string;
}

const productsData: ProductData[] = [
	{
		productName: 'Lip Butter Balm',
		brand: 'Summer Fridays',
		price: '$24.00',
		description: 'Hydration + Nourishing Shine for your lips.',
		imageSrc: '/img/products/lip-butter.webp',
	},
	{
		productName: 'Hydrating Hand Sanitizer',
		brand: 'Touchland',
		price: '$9.60',
		description: 'Power Mist to keep your hands clean & soft.',
		imageSrc: '/img/products/hand-sanitizer.webp',
	},
	{
		productName: 'Peptide Lip Balm',
		brand: 'EADEM',
		price: '$24.00',
		description: 'Exfoliating & Softening Lip Treatment.',
		imageSrc: '/img/products/lip-balm.webp',
	},
	{
		productName: 'Lip Sleeping Mask',
		brand: 'LANEIGE',
		price: '$24.00',
		description: 'Intense hydration & vitamin C enriched.',
		imageSrc: '/img/products/lip-mask.webp',
	},
];

const ProductCard = ({ product }: { product: ProductData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Box className="product-card-mobile">
				<img src={product.imageSrc} alt={product.productName} />
				<strong>{product.brand}</strong>
				<span>{product.productName}</span>
				<span>{product.price}</span>
			</Box>
		);
	} else {
		return (
			<Stack
				className="product-card"
				style={{
					backgroundImage: `url(${product.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box className="info">
					<strong>{product.brand}</strong>
					<span>{product.productName}</span>
					<span>{product.price}</span>
				</Box>
				<Box className="more">
					<span>{product.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Cosmetics = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="cosmetics-mobile">
				{productsData.map((product) => (
					<ProductCard product={product} key={product.productName} />
				))}
			</Stack>
		);
	} else {
		return (
			<Stack className="cosmetics">
				<Stack className="container">
					<Stack className="info-box">
						<Box className="left">
							<span className="white">Cosmetics</span>
							<p className="white">Top picks waiting for you!</p>
						</Box>
					</Stack>
					<Stack className="card-wrapper">
						{productsData.map((product) => (
							<ProductCard product={product} key={product.productName} />
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Cosmetics;
