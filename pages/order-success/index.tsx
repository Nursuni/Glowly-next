import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import withLayoutBasic from '@/libs/components/layout/LayoutBasic';
import { orderVar } from '../../apollo/store';

const OrderSuccessPage: NextPage = () => {
	const router = useRouter();
	const { orderId } = router.query;
	const order = useReactiveVar(orderVar);
	const [visible, setVisible] = useState(false);

	// Trigger entrance animation on mount
	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 80);
		return () => clearTimeout(t);
	}, []);

	return (
		<div id="pc-wrap">
			<div id="order-success-page">
				<style>{`
					@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

					#order-success-page {
						min-height: 100vh;
						background: #faf9f7;
						display: flex;
						align-items: flex-start;
						justify-content: center;
						padding: 64px 24px 100px;
					}

					.os-wrap {
						width: 100%;
						max-width: 680px;
						opacity: 0;
						transform: translateY(24px);
						transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
					}
					.os-wrap.visible {
						opacity: 1;
						transform: translateY(0);
					}

					/* ── Check badge ── */
					.os-check-badge {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 40px;
					}
					.os-check-ring {
						width: 80px;
						height: 80px;
						border-radius: 50%;
						border: 1.5px solid rgba(192,138,94,0.35);
						display: flex;
						align-items: center;
						justify-content: center;
						background: #fff;
						box-shadow: 0 0 0 8px rgba(192,138,94,0.06), 0 12px 40px rgba(192,138,94,0.12);
						margin-bottom: 20px;
						animation: os-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
					}
					@keyframes os-pop {
						from { transform: scale(0.6); opacity: 0; }
						to { transform: scale(1); opacity: 1; }
					}
					.os-check-ring svg {
						font-size: 38px !important;
						color: #c08a5e;
					}
					.os-eyebrow {
						font-family: 'Jost', sans-serif;
						font-size: 10px;
						font-weight: 500;
						letter-spacing: 0.3em;
						text-transform: uppercase;
						color: #c08a5e;
						margin-bottom: 10px;
					}
					.os-title {
						font-family: 'Cormorant Garamond', serif !important;
						font-size: clamp(32px, 5vw, 48px) !important;
						font-weight: 300 !important;
						color: #111 !important;
						text-align: center;
						line-height: 1.1 !important;
						margin: 0 0 12px !important;
					}
					.os-subtitle {
						font-family: 'Jost', sans-serif !important;
						font-size: 14px !important;
						font-weight: 300 !important;
						color: #888 !important;
						text-align: center;
						max-width: 400px;
						line-height: 1.7 !important;
						margin: 0 !important;
					}

					/* ── Order ID pill ── */
					.os-id-pill {
						display: inline-flex;
						align-items: center;
						gap: 10px;
						margin-top: 24px;
						padding: 10px 20px;
						border: 1px solid #e8e0d8;
						border-radius: 100px;
						background: #fff;
					}
					.os-id-pill svg {
						font-size: 16px !important;
						color: #c08a5e;
					}
					.os-id-label {
						font-family: 'Jost', sans-serif;
						font-size: 10px;
						font-weight: 500;
						letter-spacing: 0.16em;
						text-transform: uppercase;
						color: #bbb;
					}
					.os-id-sep {
						width: 1px;
						height: 14px;
						background: #e8e0d8;
					}
					.os-id-value {
						font-family: 'Jost', sans-serif;
						font-size: 13px;
						font-weight: 400;
						color: #333;
						letter-spacing: 0.04em;
					}

					/* ── Card ── */
					.os-card {
						margin-top: 40px;
						background: #fff;
						border: 1px solid #f0ebe4;
						border-radius: 16px;
						overflow: hidden;
					}

					.os-card-header {
						padding: 20px 28px;
						border-bottom: 1px solid #f0ebe4;
						display: flex;
						align-items: center;
						gap: 10px;
					}
					.os-card-header svg {
						font-size: 18px !important;
						color: #c0b8b0;
					}
					.os-card-header-title {
						font-family: 'Jost', sans-serif !important;
						font-size: 11px !important;
						font-weight: 500 !important;
						letter-spacing: 0.16em !important;
						text-transform: uppercase;
						color: #888 !important;
					}

					/* ── Items ── */
					.os-items {
						padding: 8px 0;
					}
					.os-item {
						display: flex;
						align-items: center;
						gap: 16px;
						padding: 16px 28px;
						transition: background 0.15s;
					}
					.os-item:hover {
						background: #faf9f7;
					}
					.os-item-img {
						width: 60px;
						height: 72px;
						border-radius: 8px;
						border: 1px solid #f0ebe4;
						background: #f5f0ea;
						flex-shrink: 0;
						overflow: hidden;
					}
					.os-item-img img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
					.os-item-info {
						flex: 1;
						min-width: 0;
					}
					.os-item-brand {
						font-family: 'Jost', sans-serif;
						font-size: 9px;
						font-weight: 500;
						letter-spacing: 0.22em;
						text-transform: uppercase;
						color: #f564a9;
						display: block;
						margin-bottom: 4px;
					}
					.os-item-name {
						font-family: 'Cormorant Garamond', serif;
						font-size: 18px;
						font-weight: 400;
						color: #111;
						line-height: 1.2;
						display: block;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.os-item-unit {
						font-family: 'Jost', sans-serif;
						font-size: 11px;
						font-weight: 300;
						color: #aaa;
						display: block;
						margin-top: 4px;
					}
					.os-item-right {
						text-align: right;
						flex-shrink: 0;
					}
					.os-item-qty {
						font-family: 'Jost', sans-serif;
						font-size: 11px;
						font-weight: 400;
						color: #bbb;
						display: block;
						margin-bottom: 4px;
					}
					.os-item-price {
						font-family: 'Cormorant Garamond', serif;
						font-size: 20px;
						font-weight: 400;
						color: #111;
						display: block;
					}

					/* ── Totals ── */
					.os-totals {
						border-top: 1px solid #f0ebe4;
						padding: 16px 28px;
						display: flex;
						flex-direction: column;
						gap: 10px;
					}
					.os-total-row {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					.os-total-row span:first-child {
						font-family: 'Jost', sans-serif;
						font-size: 12px;
						font-weight: 300;
						color: #aaa;
					}
					.os-total-row span:last-child {
						font-family: 'Jost', sans-serif;
						font-size: 13px;
						font-weight: 400;
						color: #666;
					}
					.os-total-row.grand span:first-child {
						font-family: 'Jost', sans-serif;
						font-size: 11px;
						font-weight: 500;
						letter-spacing: 0.14em;
						text-transform: uppercase;
						color: #111;
					}
					.os-total-row.grand span:last-child {
						font-family: 'Cormorant Garamond', serif;
						font-size: 28px;
						font-weight: 300;
						color: #111;
						letter-spacing: -0.5px;
					}
					.os-free-tag {
						font-family: 'Jost', sans-serif;
						font-size: 11px;
						font-weight: 500;
						letter-spacing: 0.1em;
						text-transform: uppercase;
						color: #c08a5e;
						background: rgba(192,138,94,0.1);
						padding: 3px 10px;
						border-radius: 100px;
					}

					/* ── Delivery card ── */
					.os-delivery-card {
						margin-top: 16px;
						padding: 18px 24px;
						background: #fff;
						border: 1px solid #f0ebe4;
						border-radius: 12px;
						display: flex;
						align-items: flex-start;
						gap: 14px;
					}
					.os-delivery-card svg {
						font-size: 20px !important;
						color: #c08a5e;
						flex-shrink: 0;
						margin-top: 1px;
					}
					.os-delivery-text {
						font-family: 'Jost', sans-serif !important;
						font-size: 13px !important;
						font-weight: 300 !important;
						color: #888 !important;
						line-height: 1.75 !important;
						margin: 0 !important;
					}
					.os-delivery-text strong {
						color: #444;
						font-weight: 500;
					}

					/* ── Actions ── */
					.os-actions {
						display: flex;
						gap: 12px;
						margin-top: 32px;
					}
					.os-btn-primary {
						flex: 1;
						height: 50px !important;
						background: #111 !important;
						color: #fff !important;
						border-radius: 4px !important;
						font-family: 'Jost', sans-serif !important;
						font-size: 12px !important;
						font-weight: 500 !important;
						letter-spacing: 0.12em !important;
						text-transform: uppercase !important;
						transition: background 0.22s, transform 0.22s !important;
					}
					.os-btn-primary:hover {
						background: #f564a9 !important;
						transform: translateY(-2px);
					}
					.os-btn-ghost {
						height: 50px !important;
						padding: 0 24px !important;
						border: 1px solid #e8e0d8 !important;
						color: #555 !important;
						border-radius: 4px !important;
						font-family: 'Jost', sans-serif !important;
						font-size: 12px !important;
						font-weight: 400 !important;
						letter-spacing: 0.08em !important;
						text-transform: uppercase !important;
						background: transparent !important;
						transition: border-color 0.2s, color 0.2s !important;
					}
					.os-btn-ghost:hover {
						border-color: #f564a9 !important;
						color: #f564a9 !important;
					}
				`}</style>

				<div className={`os-wrap ${visible ? 'visible' : ''}`}>
					{/* ── Check badge + heading ── */}
					<div className="os-check-badge">
						<div className="os-check-ring">
							<CheckCircleOutlineRoundedIcon />
						</div>
						<span className="os-eyebrow">Order Confirmed</span>
						<Typography className="os-title">
							Thank You for
							<br />
							Your Order
						</Typography>
						<Typography className="os-subtitle">
							Your order has been placed successfully and is now being prepared with care.
						</Typography>

						{/* Order ID pill */}
						{orderId && (
							<div className="os-id-pill">
								<ReceiptLongOutlinedIcon />
								<span className="os-id-label">Order ID</span>
								<span className="os-id-sep" />
								<span className="os-id-value">{orderId}</span>
							</div>
						)}
					</div>

					{/* ── Order card ── */}
					{order && order.items.length > 0 && (
						<div className="os-card">
							<div className="os-card-header">
								<StorefrontOutlinedIcon />
								<Typography className="os-card-header-title">Items Ordered</Typography>
							</div>

							<div className="os-items">
								{order.items.map((item) => (
									<div className="os-item" key={item._id}>
										<div className="os-item-img">
											<img src={item.productImage} alt={item.productName} />
										</div>
										<div className="os-item-info">
											<span className="os-item-brand">{item.productBrand}</span>
											<span className="os-item-name">{item.productName}</span>
											<span className="os-item-unit">${item.unitPrice.toFixed(2)} each</span>
										</div>
										<div className="os-item-right">
											<span className="os-item-qty">× {item.quantity}</span>
											<span className="os-item-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
										</div>
									</div>
								))}
							</div>

							<div className="os-totals">
								<div className="os-total-row">
									<span>Subtotal</span>
									<span>${order.subtotal.toFixed(2)}</span>
								</div>
								<div className="os-total-row">
									<span>Shipping</span>
									{order.shipping === 0 ? (
										<span className="os-free-tag">Free</span>
									) : (
										<span>${order.shipping.toFixed(2)}</span>
									)}
								</div>
								<div className="os-total-row grand">
									<span>Total</span>
									<span>${order.total.toFixed(2)}</span>
								</div>
							</div>
						</div>
					)}

					{/* ── Delivery note ── */}
					<div className="os-delivery-card">
						<LocalShippingOutlinedIcon />
						<Typography className="os-delivery-text">
							A confirmation email has been sent to you. Estimated delivery in <strong>3–5 business days</strong>. If
							you have any questions, our support team is happy to help.
						</Typography>
					</div>

					{/* ── Actions ── */}
					<Box className="os-actions">
						<Button
							className="os-btn-primary"
							endIcon={<ArrowForwardRoundedIcon />}
							onClick={() => router.push('/catalog')}
						>
							Continue Shopping
						</Button>
						<Button className="os-btn-ghost" onClick={() => router.push('/mypage?category=myOrder')}>
							My Purchases
						</Button>
					</Box>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderSuccessPage);
