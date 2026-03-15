import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

const OrderSuccessPage: NextPage = () => {
	const router = useRouter();
	const { orderId } = router.query;

	return (
		<div id="pc-wrap">
			<div id="order-success-page">
				<div className="success-container">
					{/* ── Icon ── */}
					<div className="success-icon-wrap">
						<CheckCircleOutlineRoundedIcon className="success-icon" />
					</div>

					{/* ── Eyebrow ── */}
					<span className="success-eyebrow">Order Confirmed</span>

					{/* ── Title ── */}
					<Typography className="success-title">Thank You for Your Order</Typography>

					{/* ── Subtitle ── */}
					<Typography className="success-subtitle">
						Your order has been placed successfully and is now being prepared with care.
					</Typography>

					{/* ── Order ID pill ── */}
					{orderId && (
						<div className="order-id-pill">
							<ReceiptLongOutlinedIcon className="order-id-icon" />
							<span className="order-id-label">Order ID</span>
							<span className="order-id-value">{orderId}</span>
						</div>
					)}

					{/* ── Divider ── */}
					<div className="success-divider" />

					{/* ── Note ── */}
					<Typography className="success-note">
						A confirmation email has been sent to you. If you have any questions, our team is happy to help.
					</Typography>

					{/* ── Actions ── */}
					<Box className="success-actions">
						<Button
							className="btn-primary"
							endIcon={<ArrowForwardRoundedIcon />}
							onClick={() => router.push('/catalog')}
						>
							Continue Shopping
						</Button>
						<Button className="btn-ghost" onClick={() => router.push('/orders')}>
							View My Purchases
						</Button>
					</Box>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderSuccessPage);
