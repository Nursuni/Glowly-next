import React from 'react';
import { Stack, Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_MY_ORDERS } from '@/apollo/user/query';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Status badge color map
const statusColors: Record<string, { bg: string; color: string }> = {
	PENDING: { bg: 'rgba(200,169,110,0.12)', color: '#c8a96e' },
	PROCESSING: { bg: 'rgba(90,154,106,0.1)', color: '#5a9a6a' },
	SHIPPED: { bg: 'rgba(80,130,200,0.1)', color: '#4a7ec8' },
	DELIVERED: { bg: 'rgba(90,154,106,0.1)', color: '#5a9a6a' },
	CANCELLED: { bg: 'rgba(192,71,58,0.08)', color: '#c0473a' },
};

const MyOrders = () => {
	const router = useRouter();

	const { data, loading } = useQuery(GET_MY_ORDERS, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				sort: 'createdAt',
				direction: -1,
				search: {},
			},
		},
	});

	const orders = data?.getMyOrders ?? [];

	// ✅ Fixed: use productId param to match detail page
	const openProduct = (id: string) => {
		if (!id) return;
		router.push(`/catalog/detail?productId=${id}`);
	};

	if (loading)
		return (
			<Stack alignItems="center" justifyContent="center" py={8}>
				<CircularProgress size={32} sx={{ color: '#c8a96e' }} />
			</Stack>
		);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

				.mo-wrap {
					padding: 0;
				}

				/* ── Section header ── */
				.mo-header {
					display: flex;
					align-items: baseline;
					gap: 12px;
					margin-bottom: 32px;
					padding-bottom: 20px;
					border-bottom: 1px solid #f0ebe4;
				}
				.mo-title {
					font-family: 'Cormorant Garamond', serif !important;
					font-size: 36px !important;
					font-weight: 300 !important;
					color: #111 !important;
					line-height: 1 !important;
					margin: 0 !important;
				}
				.mo-count {
					font-family: 'Jost', sans-serif;
					font-size: 12px;
					font-weight: 400;
					color: #bbb;
					letter-spacing: 0.06em;
				}

				/* ── Empty state ── */
				.mo-empty {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 12px;
					padding: 64px 0;
					text-align: center;
				}
				.mo-empty-ring {
					width: 64px;
					height: 64px;
					border-radius: 50%;
					border: 1px solid #f0ebe4;
					background: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 4px;
				}
				.mo-empty-ring svg {
					font-size: 26px !important;
					color: #d0c8c0;
				}
				.mo-empty-title {
					font-family: 'Cormorant Garamond', serif !important;
					font-size: 24px !important;
					font-weight: 300 !important;
					font-style: italic !important;
					color: #444 !important;
					margin: 0 !important;
				}
				.mo-empty-sub {
					font-family: 'Jost', sans-serif !important;
					font-size: 13px !important;
					font-weight: 300 !important;
					color: #aaa !important;
					margin: 0 !important;
				}

				/* ── Order card ── */
				.mo-order-card {
					background: #fff;
					border: 1px solid #f0ebe4;
					border-radius: 14px;
					overflow: hidden;
					margin-bottom: 20px;
					transition: box-shadow 0.25s ease;
				}
				.mo-order-card:hover {
					box-shadow: 0 8px 32px rgba(42,37,32,0.07);
				}

				/* Order card header row */
				.mo-order-head {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 16px 24px;
					border-bottom: 1px solid #f0ebe4;
					flex-wrap: wrap;
					gap: 10px;
				}
				.mo-order-head-left {
					display: flex;
					align-items: center;
					gap: 16px;
					flex-wrap: wrap;
				}
				.mo-order-id {
					font-family: 'Jost', sans-serif;
					font-size: 11px;
					font-weight: 500;
					letter-spacing: 0.1em;
					text-transform: uppercase;
					color: #888;
				}
				.mo-order-id span {
					color: #333;
					font-weight: 400;
					letter-spacing: 0.04em;
					text-transform: none;
				}
				.mo-order-date {
					display: flex;
					align-items: center;
					gap: 5px;
					font-family: 'Jost', sans-serif;
					font-size: 12px;
					font-weight: 300;
					color: #bbb;
				}
				.mo-order-date svg {
					font-size: 13px !important;
				}
				.mo-status-badge {
					font-family: 'Jost', sans-serif;
					font-size: 10px;
					font-weight: 500;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					padding: 4px 12px;
					border-radius: 100px;
				}

				/* Items list */
				.mo-items {
					padding: 8px 0;
				}
				.mo-item {
					display: flex;
					align-items: center;
					gap: 16px;
					padding: 14px 24px;
					cursor: pointer;
					transition: background 0.15s;
					border-bottom: 1px solid #faf8f5;
				}
				.mo-item:last-child {
					border-bottom: none;
				}
				.mo-item:hover {
					background: #faf9f7;
				}
				.mo-item:hover .mo-item-arrow {
					opacity: 1;
					transform: translateX(0);
				}
				.mo-item-img {
					width: 58px;
					height: 68px;
					border-radius: 8px;
					border: 1px solid #f0ebe4;
					background: #f5f0ea;
					overflow: hidden;
					flex-shrink: 0;
				}
				.mo-item-img img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				.mo-item-info {
					flex: 1;
					min-width: 0;
				}
				.mo-item-name {
					font-family: 'Cormorant Garamond', serif;
					font-size: 18px;
					font-weight: 400;
					color: #111;
					line-height: 1.2;
					display: block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 4px;
				}
				.mo-item-meta {
					display: flex;
					gap: 12px;
					flex-wrap: wrap;
				}
				.mo-item-tag {
					font-family: 'Jost', sans-serif;
					font-size: 11px;
					font-weight: 300;
					color: #aaa;
				}
				.mo-item-tag strong {
					color: #666;
					font-weight: 400;
				}
				.mo-item-price {
					font-family: 'Cormorant Garamond', serif;
					font-size: 20px;
					font-weight: 400;
					color: #111;
					flex-shrink: 0;
				}
				.mo-item-arrow {
					color: #c0b8b0;
					opacity: 0;
					transform: translateX(-4px);
					transition: opacity 0.2s, transform 0.2s;
					flex-shrink: 0;
				}
				.mo-item-arrow svg {
					font-size: 18px !important;
				}

				/* Order footer */
				.mo-order-foot {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 14px 24px;
					border-top: 1px solid #f0ebe4;
					background: #faf9f7;
				}
				.mo-foot-delivery {
					display: flex;
					align-items: center;
					gap: 6px;
					font-family: 'Jost', sans-serif;
					font-size: 12px;
					font-weight: 300;
					color: #aaa;
				}
				.mo-foot-delivery svg {
					font-size: 15px !important;
					color: #c8a96e;
				}
				.mo-foot-total-label {
					font-family: 'Jost', sans-serif;
					font-size: 10px;
					font-weight: 500;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					color: #bbb;
					margin-right: 10px;
				}
				.mo-foot-total-amount {
					font-family: 'Cormorant Garamond', serif;
					font-size: 26px;
					font-weight: 300;
					color: #111;
					letter-spacing: -0.5px;
				}
			`}</style>

			<div className="mo-wrap">
				{/* Header */}
				<div className="mo-header">
					<Typography className="mo-title">My Purchases</Typography>
					{orders.length > 0 && (
						<span className="mo-count">
							{orders.length} order{orders.length !== 1 ? 's' : ''}
						</span>
					)}
				</div>

				{/* Empty state */}
				{orders.length === 0 && (
					<div className="mo-empty">
						<div className="mo-empty-ring">
							<ShoppingBagOutlinedIcon />
						</div>
						<Typography className="mo-empty-title">No orders yet</Typography>
						<Typography className="mo-empty-sub">
							Your purchased items will appear here once you place an order.
						</Typography>
					</div>
				)}

				{/* Order cards */}
				{orders.map((order: any) => {
					const statusStyle = statusColors[order.orderStatus] ?? { bg: '#f5f0ea', color: '#888' };

					return (
						<div key={order._id} className="mo-order-card">
							{/* Card header */}
							<div className="mo-order-head">
								<div className="mo-order-head-left">
									<span className="mo-order-id">
										Order&nbsp;<span>{order._id?.slice(-10).toUpperCase()}</span>
									</span>
									<span className="mo-order-date">
										<CalendarTodayOutlinedIcon />
										{new Date(order.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</span>
								</div>
								<span className="mo-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
									{order.orderStatus}
								</span>
							</div>

							{/* Items */}
							<div className="mo-items">
								{order.orderItems?.map((item: any) => (
									<div key={item._id} className="mo-item" onClick={() => openProduct(item.productData?._id)}>
										<div className="mo-item-img">
											<img
												// ✅ Prefix with API_URL
												src={`${API_URL}/${item.productData?.productImages?.[0]}`}
												alt={item.productData?.productName}
											/>
										</div>
										<div className="mo-item-info">
											{/* ✅ productName matches GET_MY_ORDERS query */}
											<span className="mo-item-name">{item.productData?.productName ?? '—'}</span>
											<div className="mo-item-meta">
												<span className="mo-item-tag">
													Qty <strong>{item.itemQty}</strong>
												</span>
												{item.itemShade && (
													<span className="mo-item-tag">
														Shade <strong>{item.itemShade}</strong>
													</span>
												)}
												<span className="mo-item-tag">
													<strong>${Number(item.itemPrice).toFixed(2)}</strong> each
												</span>
											</div>
										</div>
										<span className="mo-item-price">${(Number(item.itemPrice) * item.itemQty).toFixed(2)}</span>
										<span className="mo-item-arrow">
											<ArrowForwardRoundedIcon />
										</span>
									</div>
								))}
							</div>

							{/* Card footer */}
							<div className="mo-order-foot">
								<div className="mo-foot-delivery">
									<LocalShippingOutlinedIcon />
									{order.orderStatus === 'DELIVERED'
										? 'Delivered'
										: order.orderStatus === 'SHIPPED'
										? 'On its way'
										: 'Being prepared'}
								</div>
								<div>
									<span className="mo-foot-total-label">Total</span>
									<span className="mo-foot-total-amount">${Number(order.orderTotal).toFixed(2)}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default MyOrders;
