import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation } from '@apollo/client';
import { userVar, cartVar, orderVar } from '../../apollo/store';
import { CREATE_ORDER } from '../../apollo/user/mutation';
import { toastError } from '@/libs/toast';

import { Button, Typography, Box, Divider, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';

import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

// ── Helpers ────────────────────────────────────────────────
const formatCardNumber = (v: string) =>
	v
		.replace(/\D/g, '')
		.slice(0, 16)
		.match(/.{1,4}/g)
		?.join(' ') ?? '';

const formatExpiry = (v: string) => {
	const c = v.replace(/\D/g, '').slice(0, 4);
	return c.length >= 3 ? `${c.slice(0, 2)}/${c.slice(2)}` : c;
};

const detectNetwork = (num: string) => {
	const c = num.replace(/\s/g, '');
	if (/^4/.test(c)) return 'VISA';
	if (/^5[1-5]/.test(c)) return 'MC';
	if (/^3[47]/.test(c)) return 'AMEX';
	if (/^9/.test(c)) return '체크';
	return '';
};

// ── Convert Korean phone → E.164 (+82) ────────────────────
// 010-1234-5678 or 01012345678 → +821012345678
const toE164Korea = (phone: string) => {
	const digits = phone.replace(/\D/g, '');
	if (digits.startsWith('82')) return `+${digits}`;
	if (digits.startsWith('0')) return `+82${digits.slice(1)}`;
	return `+82${digits}`;
};

// ── Delivery options ───────────────────────────────────────
const DELIVERY_OPTIONS = [
	{ value: 'STANDARD', label: 'Standard Delivery', desc: '3–5 business days', price: '$3.00' },
	{ value: 'EXPRESS', label: 'Express Delivery', desc: '1–2 business days', price: '$6.00' },
	{ value: 'SAME_DAY', label: 'Same Day Delivery', desc: 'Order before 2 PM', price: '$10.00' },
	{ value: 'PICKUP', label: 'Store Pickup', desc: 'Ready in 2 hours', price: 'Free' },
];

const CheckoutPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const cartItems = useReactiveVar(cartVar);

	const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
	const [submitting, setSubmitting] = useState(false);
	const [cardFlipped, setCardFlipped] = useState(false);

	// Shipping
	const [ship, setShip] = useState({
		name: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		note: '',
	});
	const [deliveryMethod, setDeliveryMethod] = useState('STANDARD');

	// Card
	const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '' });

	const [createOrder] = useMutation(CREATE_ORDER);

	useEffect(() => {
		if (!router.isReady) return;
		if (!user) router.push('/login?redirect=checkout');
	}, [user, router]);

	if (!user) return null;

	const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
	const deliveryFee =
		deliveryMethod === 'PICKUP'
			? 0
			: deliveryMethod === 'EXPRESS'
			? 6
			: deliveryMethod === 'SAME_DAY'
			? 10
			: subtotal > 50
			? 0
			: 3;
	const total = subtotal + deliveryFee;
	const network = detectNetwork(card.number);

	// ── Validation ─────────────────────────────────────────
	// name ≥2, phone not empty, address ≥5, city ≥2
	const shippingValid =
		ship.name.trim().length >= 2 &&
		ship.phone.trim().length >= 9 &&
		ship.address.trim().length >= 5 &&
		ship.city.trim().length >= 2;

	const cardValid =
		card.number.replace(/\s/g, '').length >= 15 &&
		card.holder.trim().length >= 2 &&
		card.expiry.length === 5 &&
		card.cvv.length >= 3;

	const handleOrder = async () => {
		if (!cardValid) {
			toastError('Please complete card details');
			return;
		}
		setSubmitting(true);
		try {
			const { data } = await createOrder({
				variables: {
					input: {
						paymentMethod: 'CARD', // PaymentMethod enum
						deliveryMethod, // DeliveryMethod enum — user selected
						recipientName: ship.name.trim(),
						// ✅ Convert to E.164 international format for @IsPhoneNumber()
						recipientPhone: toE164Korea(ship.phone),
						deliveryAddress: ship.address.trim(),
						deliveryCity: ship.city.trim(),
						deliveryZip: ship.zip.trim() || undefined,
						orderNote: ship.note.trim() || undefined,
						orderItems: cartItems.map((item) => ({
							productId: item._id,
							itemQty: item.quantity,
						})),
					},
				},
			});

			const saved = data?.createOrder;
			if (!saved) throw new Error('Order creation failed');

			orderVar({
				orderId: saved._id,
				items: [...cartItems],
				subtotal,
				shipping: saved.deliveryFee ?? deliveryFee,
				total: saved.orderTotal ?? total,
			});

			cartVar([]);
			router.push(`/order-success?orderId=${saved._id}`);
		} catch (err: any) {
			console.error('createOrder error:', err);
			toastError(err?.message ?? 'Payment failed. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const maskedNumber = (card.number || '')
		.padEnd(19, '•')
		.replace(/(.{4}\s?)/g, '$1')
		.trim();

	return (
		<div id="pc-wrap">
			<div id="checkout-page">
				<style>{`
					@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');

					#checkout-page {
						min-height: 100vh;
						background: #faf9f7;
						padding: 48px 24px 100px;
					}
					.ck-wrap { max-width: 1100px; margin: 0 auto; }

					/* Header */
					.ck-header { text-align: center; margin-bottom: 40px; }
					.ck-eyebrow {
						font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500;
						letter-spacing: 0.3em; text-transform: uppercase; color: #c08a5e;
					}
					.ck-title {
						font-family: 'Cormorant Garamond', serif !important;
						font-size: 40px !important; font-weight: 300 !important;
						color: #111 !important; margin: 8px 0 6px !important; line-height: 1.1 !important;
					}
					.ck-subtitle {
						font-family: 'Jost', sans-serif !important; font-size: 13px !important;
						font-weight: 300 !important; color: #aaa !important; margin: 0 !important;
					}

					/* Steps */
					.ck-steps { display: flex; align-items: center; justify-content: center; margin-bottom: 36px; }
					.ck-step { display: flex; align-items: center; gap: 8px; cursor: pointer; }
					.ck-step-num {
						width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #e0d8d0;
						display: flex; align-items: center; justify-content: center;
						font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500; color: #bbb; transition: all 0.2s;
					}
					.ck-step.active .ck-step-num { border-color: #f564a9; background: #f564a9; color: #fff; }
					.ck-step.done .ck-step-num { border-color: #c08a5e; background: #c08a5e; color: #fff; }
					.ck-step-label { font-family: 'Jost', sans-serif; font-size: 12px; color: #bbb; transition: color 0.2s; }
					.ck-step.active .ck-step-label, .ck-step.done .ck-step-label { color: #444; }
					.ck-step-line { width: 48px; height: 1px; background: #e8e0d8; margin: 0 8px; }

					/* Grid */
					.ck-body { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }
					@media (max-width: 860px) { .ck-body { grid-template-columns: 1fr; } }

					/* Panel */
					.ck-panel { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; overflow: hidden; }
					.ck-panel-head {
						padding: 18px 24px; border-bottom: 1px solid #f0ebe4;
						display: flex; align-items: center; gap: 10px;
					}
					.ck-panel-head svg { font-size: 18px !important; color: #c0b8b0; }
					.ck-panel-head-title {
						font-family: 'Jost', sans-serif !important; font-size: 11px !important;
						font-weight: 500 !important; letter-spacing: 0.16em !important;
						text-transform: uppercase; color: #888 !important; margin: 0 !important;
					}
					.ck-panel-body { padding: 24px; }

					/* Form fields */
					.ck-field { margin-bottom: 14px; }
					.ck-field:last-of-type { margin-bottom: 0; }
					.ck-label {
						font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500;
						letter-spacing: 0.16em; text-transform: uppercase; color: #aaa;
						display: block; margin-bottom: 6px;
					}
					.ck-input {
						width: 100%; height: 46px; padding: 0 14px; border: 1px solid #e8e0d8;
						border-radius: 6px; background: #faf9f7; font-family: 'Jost', sans-serif;
						font-size: 14px; color: #222; outline: none; transition: border-color 0.2s;
						box-sizing: border-box;
					}
					.ck-input:focus { border-color: #f564a9; background: #fff; }
					.ck-input::placeholder { color: #d0c8c0; }
					.ck-input.mono { font-family: 'Share Tech Mono', monospace; font-size: 16px; letter-spacing: 0.08em; }
					.ck-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
					.ck-row3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }

					/* Phone helper */
					.ck-phone-hint {
						font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300;
						color: #c0b8b0; margin-top: 4px;
					}

					/* Delivery options */
					.ck-delivery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
					.ck-delivery-opt {
						padding: 14px; border: 1.5px solid #e8e0d8; border-radius: 10px;
						cursor: pointer; transition: all 0.2s; background: #faf9f7;
					}
					.ck-delivery-opt:hover { border-color: #f564a9; }
					.ck-delivery-opt.selected { border-color: #f564a9; background: rgba(245,100,169,0.04); }
					.ck-delivery-opt-label {
						font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500; color: #222;
						display: block; margin-bottom: 2px;
					}
					.ck-delivery-opt-desc { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300; color: #aaa; display: block; }
					.ck-delivery-opt-price {
						font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400;
						color: #f564a9; display: block; margin-top: 6px;
					}
					.ck-delivery-opt-price.free { color: #c08a5e; }

					/* Buttons */
					.ck-btn-next {
						width: 100%; height: 48px !important; background: #111 !important; color: #fff !important;
						border-radius: 6px !important; font-family: 'Jost', sans-serif !important;
						font-size: 12px !important; font-weight: 500 !important; letter-spacing: 0.12em !important;
						text-transform: uppercase !important; margin-top: 20px !important; transition: background 0.2s, transform 0.2s !important;
					}
					.ck-btn-next:hover:not(:disabled) { background: #f564a9 !important; transform: translateY(-1px); }
					.ck-btn-next:disabled { opacity: 0.4 !important; }

					.ck-back { font-family: 'Jost', sans-serif; font-size: 12px; color: #bbb; cursor: pointer; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 4px; }
					.ck-back:hover { color: #f564a9; }

					/* Card preview */
					.card-scene { perspective: 1000px; width: 100%; height: 200px; margin: 0 auto 24px; }
					.card-body {
						width: 100%; height: 100%; position: relative;
						transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
						border-radius: 18px;
					}
					.card-body.flipped { transform: rotateY(180deg); }
					.card-face { position: absolute; inset: 0; border-radius: 18px; backface-visibility: hidden; overflow: hidden; }
					.card-front {
						background: linear-gradient(135deg, #2a2520 0%, #3d3228 45%, #1a1614 100%);
						padding: 20px 24px; display: flex; flex-direction: column; justify-content: space-between;
						box-shadow: 0 16px 48px rgba(42,37,32,0.28);
					}
					.card-front::before {
						content: ''; position: absolute; top: -40px; right: -40px; width: 180px; height: 180px;
						border-radius: 50%; background: rgba(192,138,94,0.12);
					}
					.card-chip {
						width: 34px; height: 26px; border-radius: 5px;
						background: linear-gradient(135deg, #d4af7a, #b8935a);
					}
					.card-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
					.card-network {
						font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 700;
						color: rgba(255,255,255,0.7); letter-spacing: 0.08em;
					}
					.card-num {
						font-family: 'Share Tech Mono', monospace; font-size: 18px; color: #fff;
						letter-spacing: 0.16em; position: relative; z-index: 1;
					}
					.card-bottom { display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 1; }
					.card-fl { font-family: 'Jost', sans-serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); display: block; margin-bottom: 2px; }
					.card-fv { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: #fff; text-transform: uppercase; }
					.card-back { background: linear-gradient(135deg, #1a1614, #2a2520); transform: rotateY(180deg); box-shadow: 0 16px 48px rgba(42,37,32,0.28); }
					.card-back-stripe { position: absolute; top: 32px; left: 0; right: 0; height: 40px; background: rgba(0,0,0,0.7); }
					.card-back-cvv-wrap { position: absolute; top: 92px; left: 24px; right: 24px; }
					.card-back-cvv-label { font-family: 'Jost', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 5px; }
					.card-back-cvv-band { background: #f5f0ea; border-radius: 4px; padding: 8px 12px; display: flex; justify-content: flex-end; }
					.card-back-cvv-val { font-family: 'Share Tech Mono', monospace; font-size: 15px; color: #333; letter-spacing: 0.2em; }

					/* Pay btn */
					.ck-pay-btn {
						width: 100%; height: 52px !important; margin-top: 8px;
						background: linear-gradient(135deg, #f564a9, #e04d95) !important;
						color: #fff !important; border-radius: 6px !important;
						font-family: 'Jost', sans-serif !important; font-size: 13px !important;
						font-weight: 600 !important; letter-spacing: 0.1em !important;
						text-transform: uppercase !important;
						box-shadow: 0 8px 24px rgba(245,100,169,0.3) !important;
						transition: transform 0.2s, box-shadow 0.2s !important;
					}
					.ck-pay-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 12px 32px rgba(245,100,169,0.4) !important; }
					.ck-pay-btn:disabled { opacity: 0.5 !important; box-shadow: none !important; }
					.ck-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300; color: #c0b8b0; }
					.ck-secure svg { font-size: 13px !important; }

					/* Summary */
					.ck-sum { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; overflow: hidden; position: sticky; top: 100px; }
					.ck-sum-head { padding: 16px 20px; border-bottom: 1px solid #f0ebe4; }
					.ck-sum-title { font-family: 'Cormorant Garamond', serif !important; font-size: 22px !important; font-weight: 300 !important; color: #111 !important; margin: 0 !important; }
					.ck-sum-items { padding: 6px 0; }
					.ck-sum-item { display: flex; align-items: center; gap: 12px; padding: 11px 18px; }
					.ck-sum-img { width: 46px; height: 54px; border-radius: 6px; border: 1px solid #f0ebe4; background: #f5f0ea; flex-shrink: 0; background-size: cover; background-position: center; }
					.ck-sum-info { flex: 1; min-width: 0; }
					.ck-sum-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #111; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
					.ck-sum-qty { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300; color: #bbb; }
					.ck-sum-price { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: #111; flex-shrink: 0; }
					.ck-sum-rows { padding: 12px 18px; display: flex; flex-direction: column; gap: 8px; }
					.ck-sum-row { display: flex; justify-content: space-between; font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 300; color: #aaa; }
					.ck-sum-row .free-tag { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c08a5e; background: rgba(192,138,94,0.1); padding: 2px 8px; border-radius: 100px; }
					.ck-sum-total { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 18px; border-top: 1px solid #f0ebe4; }
					.ck-sum-total-label { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #888; }
					.ck-sum-total-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #111; letter-spacing: -0.5px; }

					/* Trust */
					.trust-row { display: flex; justify-content: center; gap: 20px; margin-top: 24px; padding-top: 18px; border-top: 1px solid #f0ebe4; }
					.trust-item { display: flex; align-items: center; gap: 5px; font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300; color: #aaa; }
					.trust-item svg { font-size: 14px !important; color: #c08a5e; }

					/* textarea */
					.ck-textarea {
						width: 100%; padding: 10px 14px; border: 1px solid #e8e0d8; border-radius: 6px;
						background: #faf9f7; font-family: 'Jost', sans-serif; font-size: 13px;
						color: #444; resize: vertical; min-height: 72px; outline: none;
						transition: border-color 0.2s; box-sizing: border-box; line-height: 1.6;
					}
					.ck-textarea:focus { border-color: #f564a9; background: #fff; }
					.ck-textarea::placeholder { color: #d0c8c0; }
				`}</style>

				<div className="ck-wrap">
					{/* Header */}
					<div className="ck-header">
						<span className="ck-eyebrow">Secure Checkout</span>
						<Typography className="ck-title">Complete Your Order</Typography>
						<Typography className="ck-subtitle">SSL encrypted · PCI compliant · Safe payment</Typography>
					</div>

					{/* Steps */}
					<div className="ck-steps">
						<div className={`ck-step ${step === 'shipping' ? 'active' : 'done'}`} onClick={() => setStep('shipping')}>
							<div className="ck-step-num">{step === 'payment' ? '✓' : '1'}</div>
							<span className="ck-step-label">Shipping</span>
						</div>
						<div className="ck-step-line" />
						<div className={`ck-step ${step === 'payment' ? 'active' : ''}`}>
							<div className="ck-step-num">2</div>
							<span className="ck-step-label">Payment</span>
						</div>
					</div>

					<div className="ck-body">
						{/* LEFT */}
						<div>
							{/* ── STEP 1: Shipping ── */}
							{step === 'shipping' && (
								<div className="ck-panel">
									<div className="ck-panel-head">
										<LocalShippingOutlinedIcon />
										<Typography className="ck-panel-head-title">Shipping Information</Typography>
									</div>
									<div className="ck-panel-body">
										{/* Name */}
										<div className="ck-field">
											<label className="ck-label">Full Name *</label>
											<input
												className="ck-input"
												placeholder="Min. 2 characters"
												value={ship.name}
												onChange={(e) => setShip({ ...ship, name: e.target.value })}
											/>
										</div>

										{/* Phone */}
										<div className="ck-field">
											<label className="ck-label">Phone Number *</label>
											<input
												className="ck-input"
												placeholder="010-1234-5678 or +82101234567"
												value={ship.phone}
												onChange={(e) => setShip({ ...ship, phone: e.target.value })}
											/>
											<div className="ck-phone-hint">Korean numbers auto-convert to +82 format</div>
										</div>

										{/* Address */}
										<div className="ck-field">
											<label className="ck-label">Street Address * (min. 5 chars)</label>
											<input
												className="ck-input"
												placeholder="e.g. 123 Gangnam-daero, Gangnam-gu"
												value={ship.address}
												onChange={(e) => setShip({ ...ship, address: e.target.value })}
											/>
										</div>

										{/* City + Zip */}
										<div className="ck-row">
											<div>
												<label className="ck-label">City *</label>
												<input
													className="ck-input"
													placeholder="Seoul"
													value={ship.city}
													onChange={(e) => setShip({ ...ship, city: e.target.value })}
												/>
											</div>
											<div>
												<label className="ck-label">Postal Code</label>
												<input
													className="ck-input"
													placeholder="06000"
													value={ship.zip}
													onChange={(e) => setShip({ ...ship, zip: e.target.value })}
												/>
											</div>
										</div>

										{/* Delivery method */}
										<label className="ck-label" style={{ marginBottom: 10 }}>
											Delivery Method
										</label>
										<div className="ck-delivery-grid">
											{DELIVERY_OPTIONS.map((opt) => (
												<div
													key={opt.value}
													className={`ck-delivery-opt ${deliveryMethod === opt.value ? 'selected' : ''}`}
													onClick={() => setDeliveryMethod(opt.value)}
												>
													<span className="ck-delivery-opt-label">{opt.label}</span>
													<span className="ck-delivery-opt-desc">{opt.desc}</span>
													<span className={`ck-delivery-opt-price ${opt.price === 'Free' ? 'free' : ''}`}>
														{opt.price}
													</span>
												</div>
											))}
										</div>

										{/* Order note */}
										<div className="ck-field">
											<label className="ck-label">Order Note (optional)</label>
											<textarea
												className="ck-textarea"
												placeholder="Special instructions for your order..."
												value={ship.note}
												onChange={(e) => setShip({ ...ship, note: e.target.value })}
											/>
										</div>

										<Button
											className="ck-btn-next"
											disabled={!shippingValid}
											onClick={() => setStep('payment')}
											endIcon={<ArrowForwardRoundedIcon />}
										>
											Continue to Payment
										</Button>

										<div className="trust-row">
											{['Free Returns', 'Secure Payment', 'Fast Delivery'].map((b) => (
												<div className="trust-item" key={b}>
													<CheckCircleOutlineRoundedIcon />
													<span>{b}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							)}

							{/* ── STEP 2: Payment ── */}
							{step === 'payment' && (
								<div className="ck-panel">
									<div className="ck-panel-head">
										<CreditCardOutlinedIcon />
										<Typography className="ck-panel-head-title">Card Details</Typography>
										{network && (
											<span
												style={{
													marginLeft: 'auto',
													fontFamily: "'Jost',sans-serif",
													fontSize: 11,
													fontWeight: 700,
													color: '#888',
													letterSpacing: '0.1em',
												}}
											>
												{network}
											</span>
										)}
									</div>
									<div className="ck-panel-body">
										<span className="ck-back" onClick={() => setStep('shipping')}>
											← Back to shipping
										</span>

										{/* Card preview */}
										<div className="card-scene">
											<div className={`card-body ${cardFlipped ? 'flipped' : ''}`}>
												<div className="card-face card-front">
													<div className="card-top">
														<div className="card-chip" />
														<span className="card-network">{network || 'CARD'}</span>
													</div>
													<div className="card-num">{maskedNumber}</div>
													<div className="card-bottom">
														<div>
															<span className="card-fl">Card Holder</span>
															<span className="card-fv">{card.holder.trim() || 'YOUR NAME'}</span>
														</div>
														<div style={{ textAlign: 'right' }}>
															<span className="card-fl">Expires</span>
															<span className="card-fv">{card.expiry || 'MM/YY'}</span>
														</div>
													</div>
												</div>
												<div className="card-face card-back">
													<div className="card-back-stripe" />
													<div className="card-back-cvv-wrap">
														<div className="card-back-cvv-label">CVV / CVC</div>
														<div className="card-back-cvv-band">
															<span className="card-back-cvv-val">{'•'.repeat(card.cvv.length || 3)}</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Card inputs */}
										<div className="ck-field">
											<label className="ck-label">Card Number</label>
											<input
												className="ck-input mono"
												type="text"
												placeholder="0000 0000 0000 0000"
												value={card.number}
												maxLength={19}
												onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
											/>
										</div>
										<div className="ck-field">
											<label className="ck-label">Cardholder Name</label>
											<input
												className="ck-input"
												type="text"
												placeholder="Name on card"
												value={card.holder}
												onChange={(e) => setCard({ ...card, holder: e.target.value.toUpperCase() })}
											/>
										</div>
										<div className="ck-row">
											<div>
												<label className="ck-label">Expiry</label>
												<input
													className="ck-input mono"
													type="text"
													placeholder="MM/YY"
													value={card.expiry}
													maxLength={5}
													onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
												/>
											</div>
											<div>
												<label className="ck-label">CVV</label>
												<input
													className="ck-input mono"
													type="password"
													placeholder="•••"
													value={card.cvv}
													maxLength={4}
													onFocus={() => setCardFlipped(true)}
													onBlur={() => setCardFlipped(false)}
													onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
												/>
											</div>
										</div>

										<Button
											className="ck-pay-btn"
											disabled={!cardValid || submitting}
											onClick={handleOrder}
											endIcon={submitting ? null : <LockOutlinedIcon style={{ fontSize: 16 }} />}
										>
											{submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : `Pay $${total.toFixed(2)}`}
										</Button>

										<div className="ck-secure">
											<LockOutlinedIcon />
											<span>Your card details are encrypted and never stored</span>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* RIGHT: Summary */}
						<div className="ck-sum">
							<div className="ck-sum-head">
								<Typography className="ck-sum-title">Order Summary</Typography>
							</div>
							<div className="ck-sum-items">
								{cartItems.map((item) => (
									<div className="ck-sum-item" key={item._id}>
										<div className="ck-sum-img" style={{ backgroundImage: `url(${item.productImage})` }} />
										<div className="ck-sum-info">
											<span className="ck-sum-name">{item.productName}</span>
											<span className="ck-sum-qty">Qty {item.quantity}</span>
										</div>
										<span className="ck-sum-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
									</div>
								))}
							</div>
							<Divider sx={{ borderColor: '#f0ebe4' }} />
							<div className="ck-sum-rows">
								<div className="ck-sum-row">
									<span>Subtotal</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className="ck-sum-row">
									<span>Shipping ({DELIVERY_OPTIONS.find((o) => o.value === deliveryMethod)?.label})</span>
									{deliveryFee === 0 ? <span className="free-tag">Free</span> : <span>${deliveryFee.toFixed(2)}</span>}
								</div>
							</div>
							<div className="ck-sum-total">
								<span className="ck-sum-total-label">Total</span>
								<span className="ck-sum-total-val">${total.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(CheckoutPage);
