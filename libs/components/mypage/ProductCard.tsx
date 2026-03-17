import React, { useState } from 'react';
import { Menu, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { Product } from '../../types/product/product';
import { ProductStatus } from '../../enums/product.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { formatterStr } from '../../utils';
import { NEXT_PUBLIC_API_URL } from '../../config';

interface ProductCardProps {
	product: Product;
	deleteProductHandler?: (id: string) => void;
	updateProductHandler?: (status: string, id: string) => void;
	likeProductHandler?: any;
	memberPage?: boolean;
}

export const ProductCard = (props: ProductCardProps) => {
	const { product, deleteProductHandler, memberPage, updateProductHandler } = props;
	const router = useRouter();
	const device = useDeviceDetect();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const pushProductDetail = (id: string) => router.push({ pathname: '/catalog/detail', query: { productId: id } });

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => setAnchorEl(null);

	if (device === 'mobile') return <div>MOBILE Product CARD</div>;

	const imageSrc = product?.productImages?.[0]
		? `${NEXT_PUBLIC_API_URL}/${product.productImages[0]}`
		: '/img/banner/lobby.svg';

	return (
		<div className="product-card-box">
			{/* ── Image ── */}
			<div className="image-box" onClick={() => pushProductDetail(product._id)}>
				<img src={imageSrc} alt={product.productTitle} />
			</div>

			{/* ── Info ── */}
			<div className="information-box" onClick={() => pushProductDetail(product._id)}>
				<strong className="name">{product.productTitle}</strong>
				<span className="price">${formatterStr(product.productPrice)}</span>
				<span className="date">{dayjs(product.createdAt).format('DD MMMM, YYYY')}</span>
			</div>

			{/* ── Footer: status + views ── */}
			<div className="card-footer">
				{/* Status pill — clickable for brand owner to change */}
				<div
					className={`status-pill status-pill--${product.productStatus.toLowerCase()}`}
					onClick={!memberPage ? handleClick : undefined}
					style={{ cursor: !memberPage ? 'pointer' : 'default' }}
				>
					{product.productStatus}
				</div>

				<div className="footer-right">
					<span className="views-count">Views: {product.productViews.toLocaleString()}</span>

					{/* Action buttons — brand owner only */}
					{!memberPage && product.productStatus === ProductStatus.ACTIVE && (
						<div className="action-btns">
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
								}}
								className="icon-btn"
							>
								<ModeIcon sx={{ fontSize: 14 }} />
							</IconButton>
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									deleteProductHandler?.(product._id);
								}}
								className="icon-btn icon-btn--delete"
							>
								<DeleteIcon sx={{ fontSize: 14 }} />
							</IconButton>
						</div>
					)}
				</div>
			</div>

			{/* Status change menu */}
			{!memberPage && (
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					PaperProps={{
						elevation: 0,
						sx: {
							width: 90,
							mt: 1,
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
							borderRadius: 1,
						},
					}}
				>
					{product.productStatus === ProductStatus.ACTIVE && (
						<MenuItem
							onClick={() => {
								handleClose();
								updateProductHandler?.(ProductStatus.SOLD, product._id);
							}}
							sx={{ fontSize: 13 }}
						>
							Mark Sold
						</MenuItem>
					)}
				</Menu>
			)}
		</div>
	);
};
